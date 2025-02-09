import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { DOMHelper } from '../../src/dom';
import { ServerComponent } from '../../src/server';
import { JSDOM } from 'jsdom';

class TestComponent extends ServerComponent {
  protected content: string;

  constructor(domHelper: DOMHelper, content: string = 'Test Content') {
    super(domHelper);
    this.content = content;
    this.state = { content };
  }

  protected async createDom(): Promise<void> {
    if (!this.element) {
      this.element = this.domHelper.createElement('div');
      if (this.id) {
        this.element.id = this.id;
      }
    }
    this.element.textContent = this.state.content || this.content;
  }

  async setState(state: any): Promise<void> {
    if ('content' in state) {
      this.content = state.content;
    }
    await super.setState(state);
  }

  async hydrate(container?: HTMLElement): Promise<void> {
    if (container) {
      this.element = container.firstElementChild as HTMLElement;
      if (!this.element) {
        throw new Error('No element found for hydration');
      }
    } else if (this.id) {
      const element = this.domHelper.getElementById(this.id);
      if (element) {
        this.element = element as HTMLElement;
      }
    }
    this.element!.textContent = this.state.content || this.content;
  }
}

describe('SSR Support', () => {
  let domHelper: DOMHelper;
  let document: Document;

  beforeEach(() => {
    const jsdom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    document = jsdom.window.document;
    domHelper = new DOMHelper(document);
  });

  test('renders component server-side', async () => {
    const component = new TestComponent(domHelper);
    component.setId('test');
    const container = domHelper.createElement('div');
    await component.render(container);
    const html = await component.renderToString();
    expect(html).toBe('<div id="test">Test Content</div>');
  });

  test('hydrates component client-side', async () => {
    const component = new TestComponent(domHelper);
    component.setId('test');
    const container = domHelper.createElement('div');
    container.innerHTML = '<div id="test">Test Content</div>';
    await component.hydrate(container);
    expect(container.textContent).toBe('Test Content');
  });
});
