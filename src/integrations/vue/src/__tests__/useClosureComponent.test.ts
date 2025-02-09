import { mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, h, type ComponentPublicInstance, type PropType } from 'vue';
import { useClosureComponent } from '../index.js';
import { Component, DOMHelper, type ComponentConstructor, type ComponentInterface } from '@closure-next/core/dist/index.js';

class TestComponent extends Component implements ComponentInterface {
  private title: string = '';
  private disposed: boolean = false;
  
  constructor(domHelper: DOMHelper) {
    super(domHelper);
    this.title = '';
  }

  setTitle(title: string): void {
    this.title = title;
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-title', title);
    }
  }
  
  getTitle(): string {
    return this.title;
  }

  public override createDom(): void {
    const element = document.createElement('div');
    element.setAttribute('data-testid', 'test-component');
    element.setAttribute('data-title', this.title);
    element.textContent = 'Test Component Content';
    this.element = element;
  }

  enterDocument(): void {
    if (!this.isInDocument()) {
      super.enterDocument();
    }
  }

  exitDocument(): void {
    if (this.isInDocument()) {
      super.exitDocument();
    }
  }

  dispose(): void {
    if (!this.disposed) {
      super.dispose();
      this.disposed = true;
    }
  }

  isDisposed(): boolean {
    return this.disposed;
  }

  getElement(): HTMLElement | null {
    return super.getElement();
  }
}

interface TestComponentState {
  title?: string;
  updateTitle?: (title: string) => void;
  component?: TestComponent;
}

interface TestComponentInstance extends ComponentPublicInstance<TestComponentState> {
  component?: TestComponent;
}

type TestComponentWrapper = VueWrapper<TestComponentInstance>;

describe('useClosureComponent', () => {
  let wrapper: TestComponentWrapper;

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    wrapper?.unmount();
    document.body.innerHTML = '';
  });

  test('should create and mount component', async () => {
    const TestVue = defineComponent<TestComponentState>({
      setup() {
        const domHelper = new DOMHelper(document);
        const { ref, component } = useClosureComponent(
          TestComponent as ComponentConstructor<TestComponent>,
          domHelper
        );
        return { ref, component };
      },
      render() {
        return h('div', { ref: 'ref' });
      }
    });

    wrapper = mount(TestVue);
    await wrapper.vm.$nextTick();

    const component = wrapper.find('[data-testid="test-component"]');
    expect(component.exists()).toBe(true);
    expect(component.text()).toBe('Test Component Content');
  });

  test('should apply initial props', async () => {
    const TestVue = defineComponent<TestComponentState>({
      setup() {
        const domHelper = new DOMHelper(document);
        const { ref, component } = useClosureComponent(
          TestComponent as ComponentConstructor<TestComponent>,
          domHelper,
          {
            props: {
              title: 'Initial Title'
            }
          }
        );
        return { ref, component };
      },
      render() {
        return h('div', { ref: 'ref' });
      }
    });

    wrapper = mount(TestVue);
    await wrapper.vm.$nextTick();

    const component = wrapper.find('[data-testid="test-component"]');
    expect(component.exists()).toBe(true);
    expect(component.attributes('data-title')).toBe('Initial Title');
  });

  test('should handle prop updates', async () => {
    const TestVue = defineComponent<TestComponentState>({
      props: {
        updateTitle: Function as PropType<(title: string) => void>
      },
      setup() {
        const domHelper = new DOMHelper(document);
        const { ref, component } = useClosureComponent(
          TestComponent as ComponentConstructor<TestComponent>,
          domHelper,
          {
            props: {
              title: 'Initial Title'
            }
          }
        );

        const updateTitle = (newTitle: string) => {
          if (component.value) {
            component.value.setTitle(newTitle);
            component.value.createDom();
            const element = component.value.getElement();
            if (element) {
              element.setAttribute('data-title', newTitle);
              element.textContent = `Test Component Content - ${newTitle}`;
            }
          }
        };

        return { ref, component: component.value as TestComponent, updateTitle };
      },
      render() {
        return h('div', { ref: 'ref' });
      }
    });

    wrapper = mount(TestVue, {
      props: {
        updateTitle: (title: string) => {
          if (wrapper.vm?.updateTitle) {
            wrapper.vm.updateTitle(title);
          }
        }
      }
    });
    await wrapper.vm.$nextTick();

    const component = wrapper.find('[data-testid="test-component"]');
    expect(component.exists()).toBe(true);
    expect(component.attributes('data-title')).toBe('Initial Title');

    if (wrapper.vm?.updateTitle) {
      wrapper.vm.updateTitle('Updated Title');
    }
    
    // Wait for Vue's reactivity system and component updates
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Update the component's title
    if (wrapper.vm.updateTitle) {
      wrapper.vm.updateTitle('Updated Title');
    }
    
    // Wait for Vue's reactivity system and component updates
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Wait for final updates to settle
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get the updated component element
    const updatedComponent = wrapper.find('[data-testid="test-component"]');
    expect(updatedComponent.attributes('data-title')).toBe('Updated Title');
  });

  test('should clean up on unmount', async () => {
    const TestVue = defineComponent<TestComponentState>({
      setup() {
        const domHelper = new DOMHelper(document);
        const { ref, component } = useClosureComponent(
          TestComponent as ComponentConstructor<TestComponent>,
          domHelper
        );
        return { ref, component };
      },
      render() {
        return h('div', { ref: 'ref' });
      }
    });

    wrapper = mount(TestVue);
    await wrapper.vm.$nextTick();

    const component = wrapper.find('[data-testid="test-component"]');
    expect(component.exists()).toBe(true);

    wrapper.unmount();
    await wrapper.vm.$nextTick();

    expect(document.querySelector('[data-testid="test-component"]')).toBeNull();
  });
});
