import { JSDOM } from 'jsdom';
import { Component } from '../src/component';
import { DOMHelper } from '../src/dom';
import { EventType } from '../src/events';
import type { ComponentInterface } from '../src/types';

class TestComponent extends Component {
  protected content: string;

  constructor(domHelper: DOMHelper, content: string = 'Test Content') {
    super(domHelper);
    this.content = content;
  }

  protected override async createDom(): Promise<void> {
    await super.createDom();
    if (this.element) {
      this.element.textContent = this.content;
    }
  }

  getContent(): string {
    return this.content;
  }

  async setContent(content: string): Promise<void> {
    this.content = content;
    await this.setState({ content });
  }
}

describe('Component', () => {
  let jsdom: JSDOM;
  let document: Document;
  let domHelper: DOMHelper;

  beforeEach(() => {
    jsdom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    document = jsdom.window.document;
    domHelper = new DOMHelper(document);
    (global as any).window = jsdom.window;
    (global as any).document = document;
  });

  test('creates element on render', async () => {
    const component = new TestComponent(domHelper);
    const container = domHelper.createElement('div');
    await component.render(container);
    expect(container.textContent).toBe('Test Content');
  });

  test('handles state management', async () => {
    const component = new TestComponent(domHelper);
    const container = domHelper.createElement('div');
    await component.render(container);

    const stateListener = jest.fn();
    component.addEventListener(EventType.STATECHANGE, stateListener);

    await component.setState({ content: 'Updated Content' });
    expect(stateListener).toHaveBeenCalled();
    expect(component.getState()).toEqual({ content: 'Updated Content' });
  });

  test('manages parent-child relationships', async () => {
    const parent = new TestComponent(domHelper);
    const child = new TestComponent(domHelper);
    parent.addChild(child);

    expect(child.getParent()).toBe(parent);
    expect(parent.getChildren()).toContain(child);

    parent.removeChild(child);
    expect(child.getParent()).toBeNull();
    expect(parent.getChildren()).not.toContain(child);
  });

  test('handles component disposal', async () => {
    const component = new TestComponent(domHelper);
    const container = domHelper.createElement('div');
    await component.render(container);

    component.dispose();
    expect(component.getElement()).toBeNull();
  });

  test('manages component ID', async () => {
    const component = new TestComponent(domHelper);
    component.setId('test-id');
    await component.render(domHelper.createElement('div'));

    expect(component.getId()).toBe('test-id');
    expect(component.getElement()?.id).toBe('test-id');
  });
});
