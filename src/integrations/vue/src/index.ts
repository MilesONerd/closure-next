import { ref, shallowRef, onMounted, onBeforeUnmount, nextTick, type Ref, type ShallowRef } from 'vue';
import { Component, DOMHelper, type ComponentState } from '@closure-next/core/dist/index.js';
import type { ClosureComponentRef, ClosureComponentOptions, ClosureInstance } from './types';

export function useClosureComponent<T extends Component>(
  ComponentClass: new (domHelper?: DOMHelper) => T,
  options: ClosureComponentOptions<T> = {}
): ClosureComponentRef<T> {
  const elementRef = ref<HTMLElement | null>(null);
  const componentRef = shallowRef<ClosureInstance<T> | null>(null);

  const setProps = async (props: Partial<ComponentState>): Promise<void> => {
    if (componentRef.value) {
      Object.entries(props).forEach(([key, value]) => {
        const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof componentRef.value![method as keyof T] === 'function') {
          (componentRef.value![method as keyof T] as Function)(value);
        }
      });

      // Re-render if component is already in document
      if (componentRef.value.isInDocument()) {
        componentRef.value.exitDocument();
        await nextTick();
        componentRef.value.enterDocument();
      }
    }
  };

  const initializeComponent = async (): Promise<ClosureInstance<T>> => {
    if (!elementRef.value) {
      throw new Error('Element ref not available');
    }

    try {
      const component = new ComponentClass(new DOMHelper(document)) as ClosureInstance<T>;
      componentRef.value = component;

      // Apply initial props
      if (options.props) {
        await setProps(options.props);
      }

      // Create DOM and enter document
      component.createDom();
      const element = component.getElement();
      if (!element) {
        throw new Error('Component failed to create DOM element');
      }

      elementRef.value.appendChild(element);
      component.enterDocument();
      await nextTick();

      options.onMounted?.(component);
      return component;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      options.onError?.(err);
      throw err;
    }
  };

  onMounted(async () => {
    try {
      await initializeComponent();
    } catch (error) {
      console.error('Error during component initialization:', error);
    }
  });

  onBeforeUnmount(() => {
    const component = componentRef.value;
    if (component) {
      options.onUnmounted?.(component);
      if (component.isInDocument()) {
        component.exitDocument();
      }
      component.dispose();
      componentRef.value = null;
    }
  });

  return {
    ref: elementRef,
    component: componentRef,
    setProps
  };
}

export type { ClosureComponentRef, ClosureComponentOptions, ClosureInstance } from './types';
