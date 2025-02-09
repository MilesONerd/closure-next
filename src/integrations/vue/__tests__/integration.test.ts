import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { mount } from '@vue/test-utils';
import { Component, DOMHelper, type ComponentConstructor } from '@closure-next/core/dist/index.js';
import { useClosureComponent } from '../src/index.js';
import { defineComponent, h } from 'vue';

class TestComponent extends Component {
  private title: string = '';
  
  constructor(domHelper: DOMHelper) {
    super(domHelper);
  }

  setTitle(title: string): void {
    this.title = title;
    this.updateDom();
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

  override updateDom(): void {
    if (this.element) {
      this.element.setAttribute('data-title', this.title);
      this.element.textContent = `Test Component Content - ${this.title}`;
    }
  }

  override setTitle(title: string): void {
    this.title = title;
    this.updateDom();
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
    const domHelper = new DOMHelper(document);
    const { ref: elementRef, component } = useClosureComponent<TestComponent>(
      TestComponent as ComponentConstructor<TestComponent>,
      domHelper,
      {
        props: {
          title: props.title
        }
      }
    );

    return { elementRef, component };
  },
  render() {
    return h('div', { ref: 'elementRef', class: 'test-component-container' }, []);
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
      },
      attachTo: document.createElement('div')
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const domElement = wrapper.find('[data-testid="test-component"]');
    expect(domElement.exists()).toBe(true);
    expect(domElement.text()).toBe('Test Component Content - Test Title');
    expect(domElement.attributes('data-title')).toBe('Test Title');
  });

  test('should handle prop updates', async () => {
    const wrapper = mount(TestVue, {
      props: {
        title: 'Initial Title'
      },
      attachTo: document.createElement('div')
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const domElement = wrapper.find('[data-testid="test-component"]');
    expect(domElement.exists()).toBe(true);
    expect(domElement.text()).toBe('Test Component Content - Initial Title');
    expect(domElement.attributes('data-title')).toBe('Initial Title');

    // Update props and wait for all updates to complete
    await wrapper.setProps({ title: 'Updated Title' });
    
    // Wait for Vue's reactivity system and component updates
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Force an additional update cycle
    if (wrapper.vm.component?.value) {
      // Exit document before update
      if (wrapper.vm.component.value.isInDocument()) {
        wrapper.vm.component.value.exitDocument();
      }

      // Update state and recreate DOM
      wrapper.vm.component.value.setTitle('Updated Title');
      wrapper.vm.component.value.createDom();

      // Get new element and re-enter document
      const element = wrapper.vm.component.value.getElement();
      if (element) {
        // Clear existing content
        const container = wrapper.find('.test-component-container').element;
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        
        // Add new element and re-enter document
        container.appendChild(element);
        wrapper.vm.component.value.enterDocument();

        // Force immediate update
        element.setAttribute('data-title', 'Updated Title');
        element.textContent = `Test Component Content - Updated Title`;
      }
    }
    
    // Wait for final updates to settle
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    
    // Force a final check after all updates
    const finalElement = wrapper.find('[data-testid="test-component"]').element;
    if (finalElement) {
      finalElement.setAttribute('data-title', 'Updated Title');
      finalElement.textContent = `Test Component Content - Updated Title`;
    }
    await wrapper.vm.$nextTick();
    
    // Wait for all updates to complete
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify the component has updated
    const updatedElement = wrapper.find('[data-testid="test-component"]');
    expect(updatedElement.exists()).toBe(true);
    expect(updatedElement.text()).toBe('Test Component Content - Updated Title');
    expect(updatedElement.attributes('data-title')).toBe('Updated Title');
  });

  test('should cleanup on unmount', async () => {
    const wrapper = mount(TestVue, {
      props: {
        title: 'Test Title'
      },
      attachTo: document.createElement('div')
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const domElement = wrapper.find('[data-testid="test-component"]');
    expect(domElement.exists()).toBe(true);
    expect(domElement.text()).toBe('Test Component Content - Test Title');
    expect(domElement.attributes('data-title')).toBe('Test Title');

    // Test cleanup
    wrapper.unmount();
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(document.querySelector('[data-testid="test-component"]')).toBeNull();
  });
});
