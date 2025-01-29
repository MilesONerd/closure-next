import { mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, ref, h, type Ref, type ComponentPublicInstance } from 'vue';
import { useClosureComponent } from '../index';
import { Component, ComponentInterface } from '@closure-next/core';

// Test component definition
class TestComponent extends Component implements ComponentInterface {
  private title: string = '';
  
  setTitle(title: string) {
    this.title = title;
    this.getElement()?.setAttribute('data-title', title);
  }
  
  getTitle(): string {
    return this.title;
  }
}

// Component props and type definitions
interface TestComponentProps {
  root: Ref<HTMLElement | null>;
  component: Ref<TestComponent | null>;
  updateTitle?: (title: string) => void;
}

type TestComponentInstance = ComponentPublicInstance<{}, TestComponentProps>;
type TestComponentWrapper = VueWrapper<TestComponentInstance>;

describe('useClosureComponent', () => {
  let wrapper: TestComponentWrapper;
  let componentInstance: TestComponent | null = null;

  afterEach(() => {
    if (componentInstance) {
      componentInstance.dispose();
      componentInstance = null;
    }
    wrapper?.unmount();
  });

  test('should create and mount component', async () => {
    const TestVue = defineComponent({
      setup() {
        const { ref: elementRef, component } = useClosureComponent(TestComponent);
        return { root: elementRef, component };
      },
      render() {
        return h('div', {}, [
          h('div', { ref: 'root' })
        ]);
      }
    });

    wrapper = mount(TestVue);
    await wrapper.vm.$nextTick();

    const vm = wrapper.vm;
    const component = vm.component;
    const root = vm.root;
    
    expect(component).not.toBeNull();
    expect(root).not.toBeNull();
    
    if (!component) {
      throw new Error('Component is null');
    }
    
    expect(component).toBeInstanceOf(TestComponent);
    componentInstance = component;
  });

  test('should apply initial props', async () => {
    const TestVue = defineComponent({
      setup() {
        const { ref: elementRef, component } = useClosureComponent(TestComponent, {
          title: 'Initial Title'
        });
        return { root: elementRef, component };
      },
      render() {
        return h('div', {}, [
          h('div', { ref: 'root' })
        ]);
      }
    });

    wrapper = mount(TestVue);
    await wrapper.vm.$nextTick();

    const component = wrapper.vm.component;
    expect(component).not.toBeNull();
    if (!component) {
      throw new Error('Component is null');
    }
    expect(component.getTitle()).toBe('Initial Title');
    const element = component.getElement();
    expect(element).not.toBeNull();
    componentInstance = component;
  });

  test('should handle prop updates', async () => {
    const TestVue = defineComponent({
      setup() {
        const { ref: elementRef, component } = useClosureComponent(TestComponent, {
          title: 'Initial Title'
        });

        const updateTitle = (newTitle: string) => {
          if (component.value) {
            component.value.setTitle(newTitle);
          }
        };

        return { root: elementRef, component, updateTitle };
      },
      render() {
        return h('div', {}, [
          h('div', { ref: 'root' })
        ]);
      }
    });

    wrapper = mount(TestVue);
    await wrapper.vm.$nextTick();

    wrapper.vm.updateTitle?.('Updated Title');
    await wrapper.vm.$nextTick();

    const component = wrapper.vm.component;
    expect(component).not.toBeNull();
    if (!component) {
      throw new Error('Component is null');
    }
    expect(component.getTitle()).toBe('Updated Title');
    const element = component.getElement();
    expect(element).not.toBeNull();
    expect(element?.getAttribute('data-title')).toBe('Updated Title');
    componentInstance = component;
  });

  test('should clean up on unmount', async () => {
    const TestVue = defineComponent({
      setup() {
        const { ref: elementRef, component } = useClosureComponent(TestComponent);
        return { root: elementRef, component };
      },
      render() {
        return h('div', {}, [
          h('div', { ref: 'root' })
        ]);
      }
    });

    wrapper = mount(TestVue);
    await wrapper.vm.$nextTick();

    const component = wrapper.vm.component;
    expect(component).not.toBeNull();
    if (!component) {
      throw new Error('Component is null');
    }
    componentInstance = component;

    const disposeSpy = jest.spyOn(component, 'dispose');
    wrapper.unmount();

    expect(disposeSpy).toHaveBeenCalled();
  });
});
