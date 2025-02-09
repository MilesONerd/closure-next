import { Component, DomHelper } from '@closure-next/core';
import { renderToString, hydrateComponent } from '../../src/ssr';

class TestComponent extends Component {
  constructor(domHelper?: DomHelper) {
    super(domHelper!);
  }

  private title = '';

  setTitle(title: string): void {
    this.title = title;
  }

  createDom(): void {
    const element = this.domHelper.createElement('div');
    element.textContent = this.title;
    element.setAttribute('data-testid', 'test-component');
    this.element = element;
  }
}

describe('SSR Testing Utilities', () => {
  test('renderToString renders component to HTML', async () => {
    const html = await renderToString(TestComponent, { title: 'SSR Test' });
    expect(html).toContain('SSR Test');
    expect(html).toContain('data-testid="test-component"');
  });

  test('hydrateComponent rehydrates from HTML', async () => {
    const html = '<div data-testid="test-component">SSR Test</div>';
    const component = await hydrateComponent(TestComponent, html, { title: 'SSR Test' });
    expect(component.getElement()?.textContent).toBe('SSR Test');
  });
});
