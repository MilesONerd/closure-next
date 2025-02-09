import {
  NgModule,
  NgZone,
  Injectable,
  Inject,
  PLATFORM_ID,
  Optional,
  Input,
  Directive,
  ElementRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Component, DOMHelper } from '@closure-next/core';
import type { ClosureDirective, ClosureInstance } from './types';

@Directive({
  selector: '[closureComponent]'
})
export class ClosureComponentDirective implements OnInit, OnDestroy, ClosureDirective {
  @Input('closureComponent') component!: typeof Component;
  @Input() props?: Record<string, any>;
  @Input() errorBoundary = true;
  @Input() ssrOptions = {
    hydration: 'progressive' as 'client-only' | 'server-first' | 'progressive',
    ssr: true
  };

  private instance: ClosureInstance | null = null;
  private readonly element: HTMLElement;
  private readonly domHelper: DOMHelper;

  constructor(
    @Inject(ElementRef) private elementRef: ElementRef,
    @Inject(NgZone) private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject('CLOSURE_SSR_SERVICE') private ssrService?: any
  ) {
    this.element = this.elementRef.nativeElement;
    this.domHelper = new DOMHelper(document);
  }

  async ngOnInit(): Promise<void> {
    await this.renderComponent();
  }

  ngOnDestroy(): void {
    if (this.instance) {
      this.instance.dispose();
      this.instance = null;
    }
  }

  private async renderComponent(): Promise<void> {
    if (!this.component) {
      throw new Error('No component provided to ClosureComponentDirective');
    }

    try {
      // Create component instance
      this.instance = new this.component(this.domHelper);

      // Set props if provided
      if (this.props) {
        Object.assign(this.instance, this.props);
      }

      await this.ngZone.runOutsideAngular(async () => {
        if (isPlatformServer(this.platformId) && this.ssrOptions.ssr) {
          // Server-side rendering
          if (this.ssrService) {
            const html = await this.ssrService.renderToString(
              this.instance!,
              this.element.id || `closure-${Date.now()}`,
              this.ssrOptions
            );
            this.element.innerHTML = html;
          }
        } else {
          // Client-side rendering or hydration
          if (this.ssrService && this.ssrOptions.hydration !== 'client-only') {
            await this.ssrService.hydrate(
              this.instance!,
              this.element.id || `closure-${Date.now()}`,
              this.ssrOptions
            );
          } else {
            await this.instance!.render(this.element);
          }
        }
      });

    } catch (error) {
      console.error('Error rendering Closure component:', error);
      if (!this.errorBoundary) {
        throw error;
      }
    }
  }
}

@NgModule({
  declarations: [ClosureComponentDirective],
  exports: [ClosureComponentDirective]
})
export class ClosureModule {}
