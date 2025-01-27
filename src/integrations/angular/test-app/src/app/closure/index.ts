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
  NgZone
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
  selector: '[closureComponent]'
})
export class ClosureComponentDirective implements OnInit, OnDestroy, OnChanges {
  @Input() component!: new () => ClosureComponent;
  @Input() props?: Record<string, unknown>;

  public instance: ClosureComponent | null = null;
  private previousProps: Record<string, unknown> = {};
  private element: HTMLElement;
  private static componentMap = new WeakMap<HTMLElement, ClosureComponent>();

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone
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
      throw new Error('Component class must be provided');
    }

    // Create the Closure component
    this.instance = new this.component();
    
    // Store reference to Closure component
    this.setComponentRef(this.instance);

    // Apply props before rendering
    if (this.props) {
      Object.entries(this.props).forEach(([key, value]) => {
        const setter = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof (this.instance as any)[setter] === 'function') {
          (this.instance as any)[setter](value);
        } else if (typeof (this.instance as any)[key] === 'function') {
          (this.instance as any)[key](value);
        } else {
          (this.instance as any)[key] = value;
        }
      });
    }

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

    if (changes.props && !changes.props.firstChange) {
      const props = changes.props.currentValue || {};
      
      // Run updates inside NgZone to ensure change detection
      this.ngZone.run(() => {
        // Apply all props to ensure consistency
        Object.entries(props).forEach(([key, value]) => {
          const setter = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          if (typeof (this.instance as any)[setter] === 'function') {
            (this.instance as any)[setter](value);
          } else if (typeof (this.instance as any)[key] === 'function') {
            (this.instance as any)[key](value);
          } else {
            (this.instance as any)[key] = value;
          }
        });

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
