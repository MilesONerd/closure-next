import { mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, ref, h, type Ref, type ComponentPublicInstance, type DefineComponent } from 'vue';
import { useClosureComponent } from '../index';
import { Component } from '@closure-next/core';

interface VueComponentProps {
  root: Ref<HTMLElement | null>;
  component: Ref<TestComponent | null>;
  setTitle: (title: string) => void;
  dispose: () => void;
}

type VueComponent = DefineComponent<{}, VueComponentProps>;
type TestWrapper = VueWrapper<ComponentPublicInstance<{}, VueComponentProps>>;

// Component props defined above with imports

class TestComponent extends Component {
  private title: string = '';
  
  setTitle(title: string) {
    this.title = title;
    this.getElement()?.setAttribute('data-title', title);
  }
  
  getTitle(): string {
    return this.title;
  }
}

const TestVue = defineComponent({
  name: 'TestVue',
  emits: ['dispose'],
  setup() {
    const { ref: elementRef, component } = useClosureComponent(TestComponent, {
      title: 'Initial Title'
    });

    const setTitle = (title: string) => {
      if (component.value) {
        component.value.setTitle(title);
      }
    };

    const dispose = () => {
      if (component.value) {
        component.value.dispose();
      }
    };

    return {
      root: elementRef,
      component,
      setTitle,
      dispose
    };
  },
  render() {
    return h('div', {}, [
      h('div', { ref: 'root' })
    ]);
  }
});

describe('Vue Integration', () => {
  let wrapper: VueWrapper<ComponentPublicInstance<{}, VueComponentProps>>;

  beforeEach(() => {
    wrapper = mount(TestVue) as VueWrapper<ComponentPublicInstance<{}, VueComponentProps>>;
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  test('should mount Closure component in Vue component', async () => {
    await wrapper.vm.$nextTick();
    const component = wrapper.vm.component;
    expect(component).not.toBeNull();
    expect(component?.getTitle()).toBe('Initial Title');
    const element = component?.getElement();
    expect(element).not.toBeNull();
  });

  test('should handle prop updates', async () => {
    await wrapper.vm.$nextTick();
    wrapper.vm.setTitle('Updated Title');
    await wrapper.vm.$nextTick();
    const component = wrapper.vm.component;
    expect(component).not.toBeNull();
    expect(component?.getTitle()).toBe('Updated Title');
    const element = component?.getElement();
    expect(element).not.toBeNull();
    expect(element?.getAttribute('data-title')).toBe('Updated Title');
  });

  test('should clean up on unmount', async () => {
    await wrapper.vm.$nextTick();
    const vm = wrapper.vm as ComponentPublicInstance<{}, VueComponentProps>;
    const component = vm.component;
    expect(component).toBeTruthy();
    
    if (!component) {
      throw new Error('Component is null');
    }
    
    const disposeSpy = jest.spyOn(component, 'dispose');
    vm.dispose();
    expect(disposeSpy).toHaveBeenCalled();
  });
});
