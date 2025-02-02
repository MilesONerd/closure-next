import { ref, shallowRef, onMounted, onBeforeUnmount, watch, nextTick, type Ref, type ShallowRef } from 'vue';
import { Component, DomHelper, type ComponentConstructor } from '@closure-next/core/dist/index.js';

export interface ClosureComponentRef<T extends Component> {
  ref: Ref<HTMLElement | null>;
  component: ShallowRef<T | null>;
}

export interface ClosureComponentOptions {
  props?: Record<string, unknown>;
}

export function useClosureComponent<T extends Component>(
  ComponentClass: ComponentConstructor<T>,
  domHelper: DomHelper,
  options: ClosureComponentOptions = {}
): ClosureComponentRef<T> {
  const elementRef = ref<HTMLElement | null>(null);
  const componentRef = shallowRef<T | null>(null);

  const initializeComponent = async () => {
    if (!elementRef.value) {
      console.error('Element ref not available');
      throw new Error('Element ref is not available');
    }

    try {
      const component = new ComponentClass(domHelper);
      componentRef.value = component;

      component.createDom();
      const element = component.getElement();
      if (!element) {
        console.error('Failed to create DOM element');
        throw new Error('Component failed to create DOM element');
      }

      if (options.props) {
        for (const [key, value] of Object.entries(options.props)) {
          const setterMethod = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          const setter = (component as any)[setterMethod];
          if (typeof setter === 'function') {
            setter.call(component, value);
          }
        }
      }

      elementRef.value.appendChild(element);
      component.enterDocument();
      await nextTick();
      return component;
    } catch (error) {
      console.error('Error during component initialization:', error);
      componentRef.value = null;
      throw error;
    }
  };

  onMounted(async () => {
    try {
      const component = new ComponentClass(domHelper);
      componentRef.value = component;

      await nextTick();
      component.createDom();
      const element = component.getElement();
      
      if (!element) {
        throw new Error('Component failed to create DOM element');
      }

      if (options.props) {
        for (const [key, value] of Object.entries(options.props)) {
          const setterMethod = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          const setter = (component as any)[setterMethod];
          if (typeof setter === 'function') {
            setter.call(component, value);
          }
        }
      }

      if (!elementRef.value) {
        throw new Error('Element ref is not available');
      }

      elementRef.value.appendChild(element);
      component.enterDocument();

      if (options.props) {
        for (const [key] of Object.entries(options.props)) {
          const setterMethod = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          watch(() => options.props?.[key], (newValue) => {
            if (componentRef.value?.isInDocument()) {
              const setter = (componentRef.value as any)[setterMethod];
              if (typeof setter === 'function') {
                setter.call(componentRef.value, newValue);
              }
            }
          }, { flush: 'sync' });
        }
      }

      await nextTick();
    } catch (error) {
      console.error('Error during component initialization:', error);
      componentRef.value = null;
      throw error;
    }
  });

  onBeforeUnmount(() => {
    if (componentRef.value?.isInDocument()) {
      componentRef.value.exitDocument();
      const element = componentRef.value.getElement();
      if (element?.parentElement) {
        element.parentElement.removeChild(element);
      }
      componentRef.value = null;
    }
  });

  onBeforeUnmount(() => {
    const component = componentRef.value;
    if (component) {
      if (component.isInDocument()) {
        component.exitDocument();
      }
      const element = component.getElement();
      if (element?.parentElement) {
        element.parentElement.removeChild(element);
      }
      componentRef.value = null;
    }
  });

  return {
    ref: elementRef,
    component: componentRef
  } as ClosureComponentRef<T>;
}
