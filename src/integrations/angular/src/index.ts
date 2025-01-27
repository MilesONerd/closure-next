/**
 * @fileoverview Angular integration for Closure Next.
 * @license Apache-2.0
 */

import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  NgModule,
  NgZone,
  Injectable,
  Inject
} from '@angular/core';
import type { Component as ClosureComponent } from '@closure-next/core';

// Type declarations
import type { Type } from '@angular/core';

interface ClosureComponentConstructor {
  new(): ClosureComponent;
}

/**
 * Angular directive for using Closure Next components
 */
@Directive({
  selector: '[closureComponent]',
  standalone: true
})
@Injectable()
export class ClosureComponentDirective implements OnInit, OnDestroy, OnChanges {
  @Input('closureComponent') component!: ClosureComponent;

  public instance: ClosureComponent | null = null;
  private element: HTMLElement;
  private static componentMap = new WeakMap<HTMLElement, ClosureComponent>();

  constructor(
    @Inject(ElementRef) private elementRef: ElementRef,
    @Inject(NgZone) private ngZone: NgZone
  ) {
    this.element = this.elementRef.nativeElement;
  }

  private setComponentRef(component: ClosureComponent | null) {
    if (component) {
      ClosureComponentDirective.componentMap.set(this.element, component);
    } else {
      ClosureComponentDirective.componentMap.delete(this.element);
    }
  }

  private getComponentRef(): ClosureComponent | undefined {
    return ClosureComponentDirective.componentMap.get(this.element);
  }

  async ngOnInit(): Promise<void> {
    if (!this.component) {
      throw new Error('Component instance must be provided');
    }

    // Store the component instance
    this.instance = this.component;
    
    // Store reference to Closure component
    this.setComponentRef(this.instance);

    // Run rendering in NgZone
    await this.ngZone.run(async () => {
      // Render after props are applied
      this.instance!.render(this.element);

      // Wait for next tick to ensure component is fully initialized
      await new Promise(resolve => setTimeout(resolve, 0));

      // Force change detection
      this.ngZone.run(() => {});
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.instance) return;

    if (changes['component'] && !changes['component'].firstChange) {
      // Run updates inside NgZone to ensure change detection
      this.ngZone.run(() => {
        // Update instance reference
        this.instance = changes['component'].currentValue;
        this.setComponentRef(this.instance);
        
        // Re-render to ensure DOM is updated
        this.instance!.render(this.element);
      });
    }
  }

  async ngOnDestroy(): Promise<void> {
    if (this.instance) {
      await this.ngZone.run(async () => {
        // Clean up component reference before disposal
        this.setComponentRef(null);
        this.instance!.dispose();
        await new Promise(resolve => setTimeout(resolve, 0));
        this.instance = null;
      });
    }
  }
}

/**
 * Angular module for Closure Next integration
 */
@NgModule({
  declarations: [ClosureComponentDirective],
  exports: [ClosureComponentDirective]
})
export class ClosureNextModule {}
