# Svelte Integration Guide

## Installation

```bash
npm install @closure-next/svelte @closure-next/core
```

## Basic Usage

```svelte
<script>
import { ClosureComponent } from '@closure-next/svelte';
import { MyComponent } from './MyComponent';
</script>

<ClosureComponent 
  component={MyComponent}
  props={{ title: 'Hello World' }}
/>
```

## Server-Side Rendering

### SvelteKit Setup

```typescript
// svelte.config.js
import closure from '@closure-next/svelte/vite';

export default {
  kit: {
    vite: {
      plugins: [closure()]
    }
  }
};
```

### Hydration Strategies

```svelte
<!-- Progressive hydration -->
<ClosureComponent 
  component={MyComponent}
  hydration="progressive"
  props={{ title: 'Hello World' }}
/>

<!-- Server-first hydration -->
<ClosureComponent 
  component={MyComponent}
  hydration="server-first"
  props={{ title: 'Hello World' }}
/>

<!-- Client-only rendering -->
<ClosureComponent 
  component={MyComponent}
  hydration="client-only"
  props={{ title: 'Hello World' }}
/>
```

## Performance Optimization

### WebAssembly Integration

```svelte
<script>
import { ClosureComponent, ClosureWasm } from '@closure-next/svelte';
import { MyComponent } from './MyComponent';
</script>

<ClosureWasm let:ready>
  {#if ready}
    <ClosureComponent 
      component={MyComponent}
      wasm={true}
      props={{ title: 'Hello World' }}
    />
  {:else}
    <div>Loading WebAssembly...</div>
  {/if}
</ClosureWasm>
```

### Component Pooling

```svelte
<script>
import { ClosureComponent } from '@closure-next/svelte';
import { useComponentPool } from '@closure-next/svelte';
import { MyComponent } from './MyComponent';

export let items = [];

const pool = useComponentPool(MyComponent, {
  initialSize: 10,
  maxSize: items.length
});
</script>

{#each items as item (item.id)}
  <ClosureComponent
    component={MyComponent}
    pool={pool}
    props={item}
  />
{/each}
```

## Testing

```typescript
import { render } from '@testing-library/svelte';
import { ClosureComponent } from '@closure-next/svelte';
import { createTestComponent } from '@closure-next/testing';

test('MyComponent renders correctly', () => {
  const { container } = render(ClosureComponent, {
    props: {
      component: MyComponent,
      props: { title: 'Test' }
    }
  });
  
  expect(container).toHaveTextContent('Test');
});
```
