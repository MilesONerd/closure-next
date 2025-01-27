/**
 * @fileoverview Vue integration for Closure Next.
 * @license Apache-2.0
 */

import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue';
import type { Component } from '@closure-next/core';

export interface ClosureComponentRef<T extends Component> {
  ref: Ref<HTMLElement | null>;
  component: Ref<T | null>;
}

interface ClosureComponentOptions<T extends Component> {
  component: new () => T;
  props?: Record<string, unknown>;
}

/**
 * Vue composable for using Closure Next components
 */
export function useClosureComponent<T extends Component>(
  ComponentClass: new () => T,
  props?: Record<string, unknown>
): ClosureComponentRef<T> {
  const elementRef = ref<HTMLElement | null>(null);
  const componentRef = ref<T | null>(null) as Ref<T | null>;

  onMounted(() => {
    if (!elementRef.value) return;

    // Create and render the Closure component
    const component = new ComponentClass();
    componentRef.value = component;
    component.render(elementRef.value);

    // Apply props
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        (component as any)[key] = value;
      });
    }
  });

  onBeforeUnmount(() => {
    // Clean up on unmount
    if (componentRef.value) {
      componentRef.value.dispose();
      componentRef.value = null;
    }
  });

  return {
    ref: elementRef,
    component: componentRef
  };
}
