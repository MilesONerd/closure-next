# Closure Next Next.js Integration

Server-side rendering support for Closure Next components in Next.js applications.

## Installation

```bash
npm install @closure-next/next
```

## Usage

### Page Wrapper

```typescript
// pages/index.tsx
import { withClosureNext } from '@closure-next/next';
import { MyComponent } from '../components/MyComponent';

function HomePage() {
  return (
    <div>
      <ClosureComponent
        component={MyComponent}
        props={{
          title: 'Server-rendered component'
        }}
        ssr={true}
      />
    </div>
  );
}

export default withClosureNext(HomePage, {
  ssr: true,
  hydration: 'progressive'
});
```

### Component Usage

```typescript
// components/MyPage.tsx
import { ClosureComponent } from '@closure-next/next';
import { MyClosureComponent } from './MyClosureComponent';

export function MyPage() {
  return (
    <ClosureComponent
      component={MyClosureComponent}
      props={{
        title: 'SSR Component'
      }}
    />
  );
}
```

## Features

- 🔌 Plug-and-play integration
- 🖥️ Server-side rendering
- 💧 Progressive hydration
- ⚡️ Client-side fallback
- 🔄 Automatic cleanup
- 📦 TypeScript support

## API Reference

### `withClosureNext(PageComponent, options?)`

Higher-order component for Next.js pages.

#### Options

- `ssr`: Enable server-side rendering (default: true)
- `hydration`: Hydration strategy (default: 'progressive')
  - 'client-only': No SSR, client-side only
  - 'server-first': SSR with client hydration
  - 'progressive': Progressive hydration

### `ClosureComponent`

React component for rendering Closure components.

#### Props

- `component`: Closure component class
- `props`: Component props
- `ssr`: Enable SSR for this instance (default: true)

### `renderToString(ComponentClass, props?)`

Server-side renderer for Closure components.

### `hydrateComponent(ComponentClass, element, props?)`

Client-side hydration utility.

## TypeScript Support

```typescript
import type { Component } from '@closure-next/core';
import { withClosureNext, ClosureComponent } from '@closure-next/next';

interface MyComponentProps {
  title: string;
}

class MyComponent extends Component {
  // Implementation
}

function MyPage() {
  return (
    <ClosureComponent<MyComponent>
      component={MyComponent}
      props={{
        title: 'Hello' // Type-checked
      }}
    />
  );
}

export default withClosureNext(MyPage);
```

## Server-Side Rendering

### Custom Document

```typescript
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### Custom App

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { withClosureNext } from '@closure-next/next';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withClosureNext(MyApp);
```

## Hydration Strategies

### Client-only

```typescript
withClosureNext(Page, {
  ssr: false
});
```

### Server-first

```typescript
withClosureNext(Page, {
  ssr: true,
  hydration: 'server-first'
});
```

### Progressive

```typescript
withClosureNext(Page, {
  ssr: true,
  hydration: 'progressive'
});
```

## Development Mode

```typescript
// next.config.js
import path from 'path';

export default {
  webpack: (config) => {
    // Add Closure Next support
    config.resolve.alias['@closure-next'] = path.resolve(__dirname, 'node_modules/@closure-next');
    return config;
  }
};
```
