/**
 * @fileoverview Server-side rendering support for Angular integration.
 * @license Apache-2.0
 */

import {
  NgModule,
  ModuleWithProviders,
  StaticProvider,
  Inject,
  Injectable,
  Optional,
  PLATFORM_ID
} from '@angular/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { Component, renderToString, hydrateComponent, type SSROptions } from '@closure-next/core';

const CLOSURE_STATE_KEY = makeStateKey<Record<string, any>>('CLOSURE_STATE');

@Injectable()
export class ClosureSSRService {
  private readonly isServer: boolean;
  private stateMap = new Map<string, any>();

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(TransferState) private transferState: TransferState,
    @Optional() @Inject(DOCUMENT) private document: Document
  ) {
    this.isServer = isPlatformServer(platformId);
  }

  /**
   * Renders a component on the server and captures its state
   */
  async renderToString(
    component: Component,
    containerId: string,
    options: SSROptions = {}
  ): Promise<string> {
    if (!this.isServer || options.hydration === 'client-only') {
      return '';
    }

    // Store state for client hydration
    const existingState = this.transferState.get(CLOSURE_STATE_KEY, {});
    this.transferState.set(CLOSURE_STATE_KEY, {
      ...existingState,
      [containerId]: {}
    });

    return renderToString(component, {}, options);
  }

  /**
   * Hydrates a component on the client using transferred state
   */
  async hydrate(
    component: Component,
    containerId: string,
    options: SSROptions = {}
  ): Promise<void> {
    if (this.isServer || options.hydration === 'client-only') {
      return;
    }

    const container = this.document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }

    await hydrateComponent(component, container, {}, options);
  }
}

@NgModule({
  imports: [ServerModule],
  providers: [ClosureSSRService]
})
export class ClosureSSRModule {
  static forRoot(options: SSROptions = {}): ModuleWithProviders<ClosureSSRModule> {
    return {
      ngModule: ClosureSSRModule,
      providers: [
        { provide: 'CLOSURE_SSR_OPTIONS', useValue: options }
      ]
    };
  }
}
