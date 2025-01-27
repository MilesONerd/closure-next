# Closure Next Deno Integration

Deno compatibility layer for Closure Next, providing ESM support and Deno-specific utilities.

## Usage

```typescript
// Import directly in Deno
import { Component, createDenoElement } from 'https://deno.land/x/closure_next/mod.ts';

class MyComponent extends Component {
  protected createDom(): void {
    const element = createDenoElement('div');
    element.textContent = 'Hello from Deno!';
    this.element = element;
  }
}
```

## Features

- 🦕 Native Deno support
- 📦 ESM compatibility
- ⚡️ TypeScript/JSX support
- 🔧 Deno-specific utilities
- 🗺️ Import maps support

## API Reference

### Core Exports

All core Closure Next functionality is available:

```typescript
import {
  Component,
  EventTarget,
  DomHelper,
  utils
} from 'https://deno.land/x/closure_next/mod.ts';
```

### Deno-specific Utilities

#### `createDenoElement(tag: string): HTMLElement`

Creates an HTML element in the Deno environment.

```typescript
const div = createDenoElement('div');
```

#### `querySelector(selector: string): Element | null`

Finds the first element matching the selector.

```typescript
const element = querySelector('#myId');
```

#### `querySelectorAll(selector: string): Element[]`

Finds all elements matching the selector.

```typescript
const elements = querySelectorAll('.myClass');
```

#### `isDeno: boolean`

Runtime detection for Deno environment.

```typescript
if (isDeno) {
  // Deno-specific code
}
```

## Import Maps Support

```json
{
  "imports": {
    "@closure-next/": "https://deno.land/x/closure_next/"
  }
}
```

## Example Component

```typescript
import { Component } from 'https://deno.land/x/closure_next/mod.ts';

class DenoComponent extends Component {
  protected createDom(): void {
    const element = createDenoElement('div');
    element.innerHTML = `
      <h1>Deno Component</h1>
      <p>Running in Deno!</p>
    `;
    this.element = element;
  }
}

// Use in Deno
const component = new DenoComponent();
component.render(document.body);
```

## Server-Side Usage

```typescript
// server.ts
import { serve } from 'https://deno.land/std/http/server.ts';
import { Component } from 'https://deno.land/x/closure_next/mod.ts';

const handler = async (req: Request): Promise<Response> => {
  const component = new MyComponent();
  const html = await component.renderToString();
  
  return new Response(html, {
    headers: { 'content-type': 'text/html' },
  });
};

serve(handler);
```

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "lib": ["deno.window"],
    "types": ["deno"]
  }
}
```
