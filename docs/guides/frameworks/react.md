# React Integration Guide

## Installation

```bash
npm install @closure-next/react @closure-next/core
```

## Basic Usage

```tsx
import { ClosureComponent } from '@closure-next/react';
import { MyComponent } from './MyComponent';

function App() {
  return (
    <ClosureComponent 
      component={MyComponent}
      props={{ title: 'Hello World' }}
    />
  );
}
```

## Server-Side Rendering

### Next.js Setup

```tsx
// pages/_app.tsx
import { withClosureSSR } from '@closure-next/react';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default withClosureSSR(MyApp);
```

### Hydration Strategies

```tsx
// Progressive hydration
<ClosureComponent 
  component={MyComponent}
  hydration="progressive"
  props={{ title: 'Hello World' }}
/>

// Server-first hydration
<ClosureComponent 
  component={MyComponent}
  hydration="server-first"
  props={{ title: 'Hello World' }}
/>

// Client-only rendering
<ClosureComponent 
  component={MyComponent}
  hydration="client-only"
  props={{ title: 'Hello World' }}
/>
```

## Performance Optimization

### WebAssembly Integration

```tsx
import { useClosureWasm } from '@closure-next/react';

function App() {
  const { ready } = useClosureWasm();
  
  if (!ready) {
    return <div>Loading WebAssembly...</div>;
  }
  
  return (
    <ClosureComponent 
      component={MyComponent}
      wasm={true}
      props={{ title: 'Hello World' }}
    />
  );
}
```

### Component Pooling

```tsx
import { useComponentPool } from '@closure-next/react';

function List({ items }) {
  const pool = useComponentPool(MyComponent, {
    initialSize: 10,
    maxSize: items.length
  });

  return (
    <div>
      {items.map(item => (
        <ClosureComponent
          key={item.id}
          component={MyComponent}
          pool={pool}
          props={item}
        />
      ))}
    </div>
  );
}
```

## Testing

```tsx
import { render, fireEvent } from '@testing-library/react';
import { createTestComponent } from '@closure-next/testing';

test('MyComponent renders correctly', () => {
  const { container } = render(
    <ClosureComponent 
      component={MyComponent}
      props={{ title: 'Test' }}
    />
  );
  
  expect(container).toHaveTextContent('Test');
});
```
