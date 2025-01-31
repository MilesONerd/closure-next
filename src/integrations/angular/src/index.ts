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

@Directive({
  selector: '[closureComponent]',
  standalone: true
})
@Injectable()
export class ClosureComponentDirective implements OnInit, OnDestroy, OnChanges {
  @Input('closureComponent') component!: ClosureComponent;
  @Input() errorBoundary = true;

  public instance: ClosureComponent | null = null;
  private element: HTMLElement;
  private static componentMap = new WeakMap<HTMLElement, ClosureComponent>();
  private errorState = false;

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

  private handleError(error: Error): void {
    if (this.errorBoundary) {
      this.errorState = true;
      console.error('ClosureComponent Error:', error);
      this.element.innerHTML = `<div class="closure-error">Component Error: ${error.message}</div>`;
    } else {
      throw error;
    }
  }

  async ngOnInit(): Promise<void> {
    if (!this.component) {
      throw new Error('Component instance must be provided');
    }

    try {
      this.instance = this.component;
      this.setComponentRef(this.instance);

      await this.ngZone.runOutsideAngular(async () => {
        this.instance!.render(this.element);
        await Promise.resolve();
      });

      this.ngZone.run(() => {});
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.instance || this.errorState) return;

    if (changes['component'] && !changes['component'].firstChange) {
      try {
        this.ngZone.runOutsideAngular(() => {
          this.instance = changes['component'].currentValue;
          this.setComponentRef(this.instance);
          this.instance!.render(this.element);
        });
      } catch (error) {
        this.handleError(error as Error);
      }
    }
  }

  async ngOnDestroy(): Promise<void> {
    if (this.instance) {
      try {
        await this.ngZone.runOutsideAngular(async () => {
          this.setComponentRef(null);
          this.instance!.dispose();
          await Promise.resolve();
          this.instance = null;
        });
      } catch (error) {
        console.error('Error during component disposal:', error);
      }
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
