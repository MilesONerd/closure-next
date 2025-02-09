import { Component, DomHelper } from '@closure-next/core';
import { renderClosureComponent, hydrateClosureComponent } from '../src/server';

class TestComponent extends Component {
  private title: string = '';

  constructor() {
    super(new DomHelper(document));
  }

  setTitle(title: string): void {
    this.title = title;
    if (this.getElement()) {
      this.getElement()!.setAttribute('data-title', title);
      this.getElement()!.textContent = `Test Component Content - ${title}`;
    }
  }

  public override createDom(): void {
    if (!this.getElement()) {
      const element = document.createElement('div');
      element.className = 'test-component';
      element.setAttribute('data-title', this.title);
      element.textContent = `Test Component Content - ${this.title}`;
      this.element = element;
    }
  }
}

describe('Svelte SSR Integration', () => {
  it('should render component to string', async () => {
    const html = await renderClosureComponent(TestComponent, { title: 'SSR Title' });
    expect(html).toContain('data-title="SSR Title"');
    expect(html).toContain('Test Component Content - SSR Title');
  });

  it('should hydrate component with props', async () => {
    const container = document.createElement('div');
    container.innerHTML = '<div class="test-component" data-title="SSR Title">Test Component Content - SSR Title</div>';

    await hydrateClosureComponent(TestComponent, container, { title: 'SSR Title' });
    const element = container.querySelector('.test-component');
    expect(element).toBeTruthy();
    expect(element?.getAttribute('data-title')).toBe('SSR Title');
    expect(element?.textContent).toBe('Test Component Content - SSR Title');
  });

  it('should handle progressive hydration', async () => {
    const container = document.createElement('div');
    container.innerHTML = '<div class="test-component" data-title="SSR Title">Test Component Content - SSR Title</div>';

    await hydrateClosureComponent(TestComponent, container, { title: 'SSR Title' }, {
      hydration: 'progressive',
      ssr: true
    });

    const element = container.querySelector('.test-component');
    expect(element).toBeTruthy();
    expect(element?.getAttribute('data-title')).toBe('SSR Title');
  });
});
