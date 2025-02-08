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

      // Create DOM first
      component.createDom();
      const element = component.getElement();
      if (!element) {
        console.error('Failed to create DOM element');
        throw new Error('Component failed to create DOM element');
      }

      // Apply initial props
      if (options.props) {
        for (const [key, value] of Object.entries(options.props)) {
          const setterMethod = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          const setter = (component as any)[setterMethod];
          if (typeof setter === 'function') {
            setter.call(component, value);
            // Re-create DOM to reflect initial props
            component.createDom();
          }
        }
      }

      // Get the updated element and enter document
      const updatedElement = component.getElement();
      if (updatedElement) {
        elementRef.value.appendChild(updatedElement);
        component.enterDocument();
        await nextTick();
      }
      
      return component;
    } catch (error) {
      console.error('Error during component initialization:', error);
      componentRef.value = null;
      throw error;
    }
  };

  onMounted(async () => {
    try {
      const component = await initializeComponent();
      componentRef.value = component;

      // Set up watchers for prop changes
      if (options.props) {
        for (const [key, value] of Object.entries(options.props)) {
          // Set up watcher for each prop
          watch(() => options.props?.[key], async (newValue) => {
            if (componentRef.value) {
              const setterMethod = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
              const setter = (componentRef.value as any)[setterMethod];
              if (typeof setter === 'function') {
                try {
                  console.log('Updating prop:', key, 'to value:', newValue);
                  
                  // Update the component's state first
                  if (key === 'title') {
                    componentRef.value.setTitle(newValue);
                  } else {
                    setter.call(componentRef.value, newValue);
                  }
                  
                  // Wait for Vue's reactivity to settle
                  await nextTick();
                  
                  // Update the component's state first
                  if (componentRef.value) {
                    // Update state
                    if (key === 'title') {
                      // Exit document before update
                      if (componentRef.value.isInDocument()) {
                        componentRef.value.exitDocument();
                      }

                      // Update state and recreate DOM
                      componentRef.value.setTitle(newValue);
                      componentRef.value.createDom();

                      // Get new element and re-enter document
                      const element = componentRef.value.getElement();
                      if (element && elementRef.value) {
                        // Clear existing content
                        while (elementRef.value.firstChild) {
                          elementRef.value.removeChild(elementRef.value.firstChild);
                        }
                        elementRef.value.appendChild(element);
                        componentRef.value.enterDocument();

                        // Wait for Vue's reactivity to settle and force update
                        await nextTick();
                        await new Promise(resolve => setTimeout(resolve, 50));
                        element.setAttribute('data-title', newValue);
                        element.textContent = `Test Component Content - ${newValue}`;
                        await nextTick();
                        await new Promise(resolve => setTimeout(resolve, 50));
                      }
                    }
                  }
                } catch (error) {
                  console.error('Error during prop update:', error);
                }
              }
            }
          }, { flush: 'sync', immediate: true });
        }
      }
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

  // Return the refs
  return {
    ref: elementRef,
    component: componentRef
  } as ClosureComponentRef<T>;
}
