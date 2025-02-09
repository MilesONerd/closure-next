import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { Component } from '../../src/component';
import { DOMHelper } from '../../src/dom';
import { EventType } from '../../src/events';
import type { ComponentState } from '../../src/types';
import { JSDOM } from 'jsdom';

class TestComponent extends Component {
  protected content: string;

  constructor(domHelper: DOMHelper, content: string = 'Test Content') {
    super(domHelper);
    this.content = content;
    this.state = { content };
  }

  protected async createDom(): Promise<void> {
    await super.createDom();
    if (this.element) {
      this.element.textContent = this.state.content || this.content;
    }
  }

  async setState(state: ComponentState): Promise<void> {
    if ('content' in state) {
      this.content = state.content;
    }
    await super.setState(state);
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
  });

  test('handles state management', async () => {
    const component = new TestComponent(domHelper);
    const container = domHelper.createElement('div');
    await component.render(container);

    const stateListener = jest.fn();
    component.addEventListener(EventType.STATECHANGE, stateListener);

    await component.setState({ test: 'value', content: 'Updated Content' });
    expect(stateListener).toHaveBeenCalled();
    expect(component.getState()).toEqual({ test: 'value', content: 'Updated Content' });
    expect(container.textContent).toBe('Updated Content');
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

  test('manages component ID', async () => {
    const container = domHelper.createElement('div');
    const component = new TestComponent(domHelper);
    component.setId('test-id');
    await component.render(container);

    expect(component.getId()).toBe('test-id');
    expect(container.id).toBe('test-id');
  });

  test('disposes correctly', async () => {
    const container = domHelper.createElement('div');
    const component = new TestComponent(domHelper);
    await component.render(container);
    const disposeListener = jest.fn();
    component.addEventListener(EventType.DISPOSE, disposeListener);
    component.dispose();

    expect(disposeListener).toHaveBeenCalled();
    expect(component.isDisposed()).toBe(true);
  });
});
