/**
 * @fileoverview Node.js compatibility layer for Closure Next.
 * @license Apache-2.0
 */

import type { Component } from '@closure-next/core';

/**
 * Server-side rendering for Closure Next components
 */
export function renderToString(
  ComponentClass: new (props?: Record<string, unknown>) => Component,
  props?: Record<string, unknown>
): string {
  const component = new ComponentClass(props);

  // Create a temporary element for rendering
  const element = document.createElement('div');
  component.render(element);
  
  // Get the rendered HTML
  const html = element.innerHTML;
  
  // Clean up
  component.dispose();
  
  return html;
}

/**
 * CommonJS compatibility wrapper
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderToString
  };
}

/**
 * ESM compatibility
 */
export default {
  renderToString
};
