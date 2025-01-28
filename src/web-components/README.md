# Closure Next Web Components Integration

Package and use Closure Next components directly as Custom Elements.

## Installation

```bash
npm install @closure-next/web-components
```

## Usage

```typescript
import { defineClosureElement } from '@closure-next/web-components';
import { MyComponent } from './my-component';

// Define a custom element
defineClosureElement('my-element', MyComponent, {
  observedAttributes: ['title'],
  shadow: true
});

// Use in HTML
const html = `
  <my-element title="Hello from Web Components"></my-element>
`;
```

## Features

- 🔌 Custom Elements v1 support
- 🎭 Shadow DOM support
- 📝 HTML template integration
- ⚡️ Attribute observation
- 🔄 Automatic lifecycle management
- 🎯 TypeScript support

## API Reference

### `defineClosureElement(tagName, ComponentClass, options?)`

Defines a custom element that wraps a Closure Next component.

#### Parameters

- `tagName`: string - The tag name for the custom element
- `ComponentClass`: Constructor - The Closure Next component class
- `options`: Object
  - `observedAttributes`: string[] - Attributes to observe for changes
  - `shadow`: boolean - Whether to use Shadow DOM

### `createClosureTemplate(ComponentClass, props?)`

Creates an HTML template for a Closure component.

#### Parameters

- `ComponentClass`: Constructor - The Closure Next component class
- `props`: Object - Initial props for the component

#### Returns

An HTMLTemplateElement containing the rendered component.

## TypeScript Support

```typescript
import type { Component } from '@closure-next/core';
import { defineClosureElement } from '@closure-next/web-components';

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

class MyComponent extends Component {
  // Implementation
}

defineClosureElement<MyComponent>('my-element', MyComponent, {
  observedAttributes: ['title']
});
```

## Shadow DOM Usage

```typescript
defineClosureElement('my-element', MyComponent, {
  shadow: true,
  observedAttributes: ['title']
});
```

## Template Usage

```typescript
import { createClosureTemplate } from '@closure-next/web-components';

const template = createClosureTemplate(MyComponent, {
  title: 'Template Example'
});

document.body.appendChild(template.content.cloneNode(true));
```

## Event Handling

```typescript
class MyElement extends HTMLElement {
  // The custom element will automatically proxy events from the Closure component
}

defineClosureElement('my-element', MyComponent);

const element = document.querySelector('my-element');
element.addEventListener('click', () => {
  console.log('Element clicked');
});
```
