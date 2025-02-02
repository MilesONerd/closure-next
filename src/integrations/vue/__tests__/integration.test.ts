import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { mount } from '@vue/test-utils';
import { Component, DomHelper, type ComponentConstructor } from '@closure-next/core/dist/index.js';
import { useClosureComponent } from '../src/index.js';
import { defineComponent, h } from 'vue';

class TestComponent extends Component {
  private title: string = '';
  
  constructor(domHelper: DomHelper) {
    super(domHelper);
  }

  setTitle(title: string): void {
    this.title = title;
    if (this.element) {
      this.element.setAttribute('data-title', title);
      this.element.textContent = `Test Component Content - ${title}`;
    }
  }
  
  getTitle(): string {
    return this.title;
  }

  override createDom(): void {
    const element = document.createElement('div');
    element.setAttribute('data-testid', 'test-component');
    element.setAttribute('data-title', this.title);
    element.textContent = `Test Component Content - ${this.title}`;
    this.element = element;
  }

  override enterDocument(): void {
    if (!this.element) {
      this.createDom();
    }
    if (!this.isInDocument()) {
      super.enterDocument();
    }
  }

  override exitDocument(): void {
    if (this.isInDocument()) {
      super.exitDocument();
    }
  }

  override dispose(): void {
    if (this.isInDocument()) {
      this.exitDocument();
    }
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
    super.dispose();
  }
}

const TestVue = defineComponent({
  props: {
    title: {
      type: String,
      default: 'Initial Title'
    }
  },
  setup(props) {
    const domHelper = new DomHelper(document);
    const { component } = useClosureComponent<TestComponent>(
      TestComponent as ComponentConstructor<TestComponent>,
      domHelper,
      {
        props: {
          title: props.title
        }
      }
    );

    return { component, title: props.title };
  },
  render() {
    return h('div', { class: 'test-component-container' });
  }
});

describe('Vue Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should mount and render component', async () => {
    const wrapper = mount(TestVue, {
      props: {
        title: 'Test Title'
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const component = wrapper.find('[data-testid="test-component"]');
    expect(component.exists()).toBe(true);
    expect(component.text()).toBe('Test Component Content - Test Title');
    expect(component.attributes('data-title')).toBe('Test Title');
  });

  test('should handle prop updates', async () => {
    const wrapper = mount(TestVue, {
      props: {
        title: 'Initial Title'
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const component = wrapper.find('[data-testid="test-component"]');
    expect(component.exists()).toBe(true);
    expect(component.text()).toBe('Test Component Content - Initial Title');
    expect(component.attributes('data-title')).toBe('Initial Title');

    // Test prop update
    await wrapper.setProps({ title: 'Updated Title' });
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(component.text()).toBe('Test Component Content - Updated Title');
    expect(component.attributes('data-title')).toBe('Updated Title');
  });

  test('should cleanup on unmount', async () => {
    const wrapper = mount(TestVue, {
      props: {
        title: 'Test Title'
      }
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const component = wrapper.find('[data-testid="test-component"]');
    expect(component.exists()).toBe(true);
    expect(component.text()).toBe('Test Component Content - Test Title');
    expect(component.attributes('data-title')).toBe('Test Title');

    // Test cleanup
    wrapper.unmount();
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(document.querySelector('[data-testid="test-component"]')).toBeNull();
  });
});
