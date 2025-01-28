/**
 * @fileoverview Nuxt.js integration for Closure Next.
 * @license Apache-2.0
 */

import type { Component } from '@closure-next/core';
import { defineComponent, h, ref, onMounted, onBeforeUnmount, type PropType } from '@vue/runtime-core';
import type { VNode } from '@vue/runtime-core';

// Use any for Nuxt types until module resolution is fixed
type NuxtApp = any;

interface ClosureNextNuxtOptions {
  /** Enable SSR for Closure components */
  ssr?: boolean;
  /** Hydration strategy */
  hydration?: 'client-only' | 'server-first' | 'progressive';
}

/**
 * Nuxt.js plugin for Closure Next integration
 */
export const closureNextPlugin = (nuxtApp: NuxtApp) => {
  // Inject Closure Next functionality
  nuxtApp.provide('closureNext', {
    renderComponent: (
      ComponentClass: new () => Component,
      props?: Record<string, unknown>
    ): string => {
      const component = new ComponentClass();
      
      // Apply props before rendering
      if (props) {
        Object.entries(props).forEach(([key, value]) => {
          (component as any)[key] = value;
        });
      }

      // Create a temporary element for rendering
      const element = document.createElement('div');
      component.render(element);
      
      // Get the rendered HTML
      const html = element.innerHTML;
      
      // Clean up
      component.dispose();
      
      return html;
    },

    hydrateComponent: <T extends Component>(
      ComponentClass: new () => T,
      element: HTMLElement,
      props?: Record<string, unknown>
    ): T => {
      const component = new ComponentClass();
      
      // Apply props before hydration
      if (props) {
        Object.entries(props).forEach(([key, value]) => {
          (component as any)[key] = value;
        });
      }

      // Hydrate the component
      component.render(element);
      
      return component;
    }
  });
};

/**
 * Vue component for Closure components with SSR support
 */
export const ClosureComponent = defineComponent({
  name: 'ClosureComponent',
  
  props: {
    component: {
      type: Function as unknown as PropType<new () => Component>,
      required: true
    },
    props: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({})
    },
    ssr: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    const instance = ref<Component | null>(null);
    const nuxtApp = {
      $closureNext: {
        renderComponent: (
          ComponentClass: new () => Component,
          props?: Record<string, unknown>
        ) => {
          const component = new ComponentClass();
          if (props) {
            Object.entries(props).forEach(([key, value]) => {
              (component as any)[key] = value;
            });
          }
          const element = document.createElement('div');
          component.render(element);
          return element.innerHTML;
        },
        hydrateComponent: (
          ComponentClass: new () => Component,
          element: HTMLElement,
          props?: Record<string, unknown>
        ) => {
          const component = new ComponentClass();
          if (props) {
            Object.entries(props).forEach(([key, value]) => {
              (component as any)[key] = value;
            });
          }
          component.render(element);
          return component;
        }
      }
    };

    onMounted(() => {
      const el = document.querySelector(`[data-closure-id="${props.component.name}"]`);
      if (!el) return;

      // Hydrate or render the component
      instance.value = nuxtApp.$closureNext.hydrateComponent(
        props.component,
        el as HTMLElement,
        props.props
      );
    });

    onBeforeUnmount(() => {
      if (instance.value) {
        instance.value.dispose();
        instance.value = null;
      }
    });

    return () => {
      // Handle server-side rendering
      if (props.ssr && (process as any).server) {
        const html = nuxtApp.$closureNext.renderComponent(
          props.component,
          props.props
        );
        return h('div', {
          'data-closure-id': props.component.name,
          innerHTML: html
        });
      }

      return h('div', {
        'data-closure-id': props.component.name
      });
    };
  }
});

// Export the plugin
