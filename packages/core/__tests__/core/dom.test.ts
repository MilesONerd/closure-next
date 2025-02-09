import { describe, test, expect, beforeEach } from '@jest/globals';
import { DOMHelper } from '../../src/dom';

describe('DOMHelper', () => {
  let domHelper: DOMHelper;

  beforeEach(() => {
    document.body.innerHTML = '';
    domHelper = new DOMHelper(document);
  });

  test('creates elements', () => {
    const div = domHelper.createElement('div');
    expect(div.nodeType).toBe(Node.ELEMENT_NODE);
    expect(div.tagName).toBe('DIV');

    const span = domHelper.createElement('span');
    expect(span.tagName).toBe('SPAN');
  });

  test('handles attributes', () => {
    const div = domHelper.createElement('div');
    domHelper.setAttribute(div, 'data-test', 'value');
    expect(domHelper.getAttribute(div, 'data-test')).toBe('value');
    
    domHelper.removeAttribute(div, 'data-test');
    expect(domHelper.getAttribute(div, 'data-test')).toBeNull();
  });

  test('queries elements', () => {
    const div = domHelper.createElement('div');
    domHelper.setAttribute(div, 'id', 'test');
    domHelper.appendChild(document.body, div);
    const found = domHelper.getElementById('test');
    expect(found).toBe(div);
  });

  test('creates text nodes', () => {
    const text = domHelper.createTextNode('Hello');
    expect(text.nodeType).toBe(Node.TEXT_NODE);
    expect(text.textContent).toBe('Hello');
  });

  test('handles element queries', () => {
    const div1 = domHelper.createElement('div');
    const div2 = domHelper.createElement('div');
    const span = domHelper.createElement('span');
    
    domHelper.appendChild(document.body, div1);
    domHelper.appendChild(document.body, div2);
    domHelper.appendChild(div1, span);

    const divs = domHelper.getElementsByTagName('div');
    expect(divs.length).toBe(2);
    expect(divs[0]).toBe(div1);
    expect(divs[1]).toBe(div2);

    const spans = domHelper.getElementsByTagName('span');
    expect(spans.length).toBe(1);
    expect(spans[0]).toBe(span);
  });
});
