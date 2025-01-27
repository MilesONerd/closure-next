# Closure Next React Integration

Plug-and-play integration between Closure Next components and React applications.

## Installation

```bash
npm install @closure-next/react
```

## Usage

### Using the Hook

```tsx
import { useClosureComponent } from '@closure-next/react';
import { MyClosureComponent } from './my-component';

function MyReactComponent() {
  const ref = useClosureComponent(MyClosureComponent, {
    // Initial props
    title: 'Hello from Closure Next',
    onClick: () => alert('Clicked!')
  });

  return <div ref={ref} />;
}
```

### Using the Component

```tsx
import { ClosureComponent } from '@closure-next/react';
import { MyClosureComponent } from './my-component';

function MyReactComponent() {
  return (
    <ClosureComponent
      component={MyClosureComponent}
      props={{
        title: 'Hello from Closure Next',
        onClick: () => alert('Clicked!')
      }}
    />
  );
}
```

## Features

- 🔌 Plug-and-play integration
- ⚡️ Full TypeScript support
- 🔄 Reactive props
- 🧹 Automatic cleanup
- 🎯 Direct DOM integration
- ⚛️ React hooks support

## API Reference

### `useClosureComponent<T extends Component>(ComponentClass, props?)`

A React hook that creates and manages a Closure Next component.

#### Parameters

- `ComponentClass`: Constructor - The Closure Next component class
- `props?`: Object - Props to pass to the component

#### Returns

A ref object that should be attached to a DOM element.

### `ClosureComponent<T extends Component>`

A React component that wraps a Closure Next component.

#### Props

- `component`: Constructor - The Closure Next component class
- `props?`: Object - Props to pass to the component

## TypeScript Support

```tsx
import type { Component } from '@closure-next/core';
import { useClosureComponent } from '@closure-next/react';

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

class MyComponent extends Component {
  // Implementation
}

function MyReactComponent() {
  const ref = useClosureComponent<MyComponent>(MyComponent, {
    title: 'Hello', // Type-checked
    onClick: () => {} // Type-checked
  });

  return <div ref={ref} />;
}
```
