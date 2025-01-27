# Closure Next Svelte Integration

Plug-and-play integration between Closure Next components and Svelte applications.

## Installation

```bash
npm install @closure-next/svelte
```

## Usage

```svelte
<script lang="ts">
  import { closureComponent } from '@closure-next/svelte';
  import { MyClosureComponent } from './my-component';
  
  let target: HTMLElement;
  
  const component = closureComponent({
    target,
    component: MyClosureComponent,
    props: {
      // Initial props
      title: 'Hello from Closure Next'
    }
  });
  
  // Component is automatically destroyed when the Svelte component is destroyed
</script>

<div bind:this={target}></div>
```

## Features

- 🔌 Plug-and-play integration
- ⚡️ Full TypeScript support
- 🔄 Reactive props
- 🧹 Automatic cleanup
- 🎯 Direct DOM integration
- 🔧 Compatible with Svelte's component lifecycle

## API Reference

### `closureComponent<T extends Component>(options: ClosureComponentOptions<T>)`

Creates a Svelte-compatible wrapper for a Closure Next component.

#### Options

- `target`: HTMLElement - The DOM element to render the component into
- `component`: Constructor - The Closure Next component class
- `props?`: Object - Initial props for the component

#### Returns

A Svelte component instance that wraps the Closure Next component.

## Example

```svelte
<script lang="ts">
  import { closureComponent } from '@closure-next/svelte';
  import { Button } from '@closure-next/core';
  
  let buttonTarget: HTMLElement;
  
  const button = closureComponent({
    target: buttonTarget,
    component: Button,
    props: {
      label: 'Click me',
      onClick: () => alert('Button clicked!')
    }
  });
</script>

<div bind:this={buttonTarget}></div>
```

## TypeScript Support

The integration includes full TypeScript support:

```typescript
import type { Component } from '@closure-next/core';

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

class MyComponent extends Component {
  // Implementation
}

const component = closureComponent<MyComponent>({
  target: element,
  component: MyComponent,
  props: {
    title: 'Hello', // Type-checked
    onClick: () => {} // Type-checked
  }
});
```
