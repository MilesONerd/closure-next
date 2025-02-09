# Server-Side Rendering Guide

## Overview

Closure Next provides built-in SSR support with three hydration strategies:

- `client-only`: Client-side only rendering, no server hydration
- `server-first`: Full server rendering with immediate client hydration
- `progressive`: Server rendering with progressive client hydration

## Implementation Details

### Server Rendering

```typescript
import { renderToString } from '@closure-next/core';

const html = await renderToString(MyComponent, {
  props: { title: 'Hello World' },
  ssr: true
});
```

### Client Hydration

```typescript
import { hydrateComponent } from '@closure-next/core';

const component = await hydrateComponent(MyComponent, container, {
  props: { title: 'Hello World' },
  hydration: 'progressive'
});
```

## Framework Integration

### Next.js (React)

```typescript
// pages/_app.tsx
import { withClosureSSR } from '@closure-next/react';

export default withClosureSSR(MyApp);
```

### Nuxt.js (Vue)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@closure-next/nuxt']
});
```

### Angular Universal

```typescript
// app.module.ts
import { ClosureSSRModule } from '@closure-next/angular';

@NgModule({
  imports: [ClosureSSRModule.forRoot()]
})
export class AppModule {}
```

### SvelteKit

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

## State Management

### Server State Serialization

```typescript
// Server-side
const state = await component.getState();
const serializedState = JSON.stringify(state);

// Client-side
const state = JSON.parse(serializedState);
await component.setState(state);
```

### Progressive Loading

```typescript
// Component with progressive loading
class MyComponent extends Component {
  async loadData() {
    // Load data progressively after hydration
    const data = await fetch('/api/data');
    this.setState({ data });
  }

  protected override createDom() {
    if (this.isHydrating()) {
      // Show loading state during hydration
      this.element = this.domHelper.createElement('div');
      this.element.textContent = 'Loading...';
      
      // Load data after hydration
      this.loadData();
    } else {
      // Normal rendering
      this.element = this.domHelper.createElement('div');
      this.element.textContent = this.state.data;
    }
  }
}
```

## Performance Optimization

### Resource Loading

```typescript
// Preload critical resources
<link rel="preload" href="/wasm/closure-next.wasm" as="fetch" crossorigin>

// Async chunk loading
const chunk = await import('./chunk');
```

### Memory Management

```typescript
// Use component pooling for better memory usage
const pool = useComponentPool(MyComponent, {
  initialSize: 10,
  maxSize: 100
});

// Reuse components from pool
const component = pool.acquire();
// ... use component ...
pool.release(component);
```
