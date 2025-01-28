# Closure Next Nuxt.js Integration

Server-side rendering support for Closure Next components in Nuxt.js applications.

## Installation

```bash
npm install @closure-next/nuxt
```

## Usage

### Plugin Registration

```typescript
// nuxt.config.ts
export default {
  plugins: ['@closure-next/nuxt']
};
```

### Component Usage

```vue
<template>
  <closure-component
    :component="MyClosureComponent"
    :props="{
      title: 'Server-rendered component'
    }"
    :ssr="true"
  />
</template>

<script>
import { MyClosureComponent } from './MyClosureComponent';

export default {
  data() {
    return {
      MyClosureComponent
    };
  }
};
</script>
```

## Features

- 🔌 Plug-and-play integration
- 🖥️ Server-side rendering
- 💧 Progressive hydration
- ⚡️ Client-side fallback
- 🔄 Automatic cleanup
- 📦 TypeScript support

## API Reference

### `closureNextPlugin`

Nuxt.js plugin that provides Closure Next functionality.

### `ClosureComponent`

Vue component for rendering Closure components.

#### Props

- `component`: Closure component class
- `props`: Component props
- `ssr`: Enable SSR for this instance (default: true)

### `$closureNext`

Injected plugin instance with utility methods:

- `renderComponent(ComponentClass, props?)`: Server-side renderer
- `hydrateComponent(ComponentClass, element, props?)`: Client-side hydration

## TypeScript Support

```typescript
import type { Component } from '@closure-next/core';
import { ClosureComponent } from '@closure-next/nuxt';

interface MyComponentProps {
  title: string;
}

class MyComponent extends Component {
  // Implementation
}

export default {
  components: {
    ClosureComponent
  },
  data() {
    return {
      component: MyComponent,
      props: {
        title: 'Hello' // Type-checked
      }
    };
  }
};
```

## Server-Side Rendering

### Custom Layout

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <nuxt />
  </div>
</template>
```

### Custom Error Page

```vue
<!-- layouts/error.vue -->
<template>
  <div>
    <closure-component
      :component="ErrorComponent"
      :props="{ error }"
    />
  </div>
</template>
```

## Hydration Strategies

### Client-only

```vue
<closure-component
  :component="MyComponent"
  :ssr="false"
/>
```

### Server-first

```vue
<closure-component
  :component="MyComponent"
  :ssr="true"
/>
```

### Progressive

```typescript
// nuxt.config.ts
export default {
  plugins: [
    ['@closure-next/nuxt', { hydration: 'progressive' }]
  ]
};
```

## Development Mode

```typescript
// nuxt.config.ts
export default {
  build: {
    extend(config) {
      // Add Closure Next support
      config.resolve.alias['@closure-next'] = '~/node_modules/@closure-next';
    }
  }
};
```
