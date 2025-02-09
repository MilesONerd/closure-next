import { onMount, onDestroy } from 'svelte';
import { writable, get } from 'svelte/store';
import { Component, DomHelper } from '@closure-next/core/dist/index.js';
import type { ClosureComponentOptions, ClosureStore, ClosureInstance, ClosureSSRContext } from './types';

export function createClosureStore<T extends Component>(
  ComponentClass: new (domHelper?: DomHelper) => T,
  options: ClosureComponentOptions<T> = {}
): ClosureStore<T> {
  const component = writable<ClosureInstance<T> | null>(null);
  const props = writable(options.props || {});
  const element = writable<HTMLElement | null>(null);

  const setProps = async (newProps: Partial<typeof props>): Promise<void> => {
    const currentComponent = get(component);
    if (currentComponent) {
      Object.entries(newProps).forEach(([key, value]) => {
        const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof currentComponent[method as keyof typeof currentComponent] === 'function') {
          (currentComponent[method as keyof typeof currentComponent] as Function)(value);
        }
      });

      // Re-render if component is in document
      if (currentComponent.isInDocument()) {
        currentComponent.exitDocument();
        currentComponent.enterDocument();
      }
    }
    props.set({ ...get(props), ...newProps });
  };

  onMount(() => {
    try {
      const instance = new ComponentClass(new DomHelper(document)) as ClosureInstance<T>;
      component.set(instance);

      // Apply initial props
      const currentProps = get(props);
      if (currentProps) {
        Object.entries(currentProps).forEach(([key, value]) => {
          const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          if (typeof instance[method as keyof typeof instance] === 'function') {
            (instance[method as keyof typeof instance] as Function)(value);
          }
        });
      }

      const currentElement = get(element);
      if (currentElement) {
        instance.render(currentElement);
      }

      options.onMount?.(instance);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      options.onError?.(err);
      throw err;
    }
  });

  onDestroy(() => {
    const currentComponent = get(component);
    if (currentComponent) {
      options.onDestroy?.(currentComponent);
      if (currentComponent.isInDocument()) {
        currentComponent.exitDocument();
      }
      currentComponent.dispose();
      component.set(null);
    }
  });

  return {
    component,
    props,
    element,
    setProps
  };
}

export * from './types';
