# Closure Next Vite Plugin

Vite integration for Closure Next, providing fast development and optimized builds.

## Installation

```bash
npm install @closure-next/vite
```

## Usage

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { closureNextVite } from '@closure-next/vite';

export default defineConfig({
  plugins: [
    closureNextVite({
      hmr: true,
      paths: {
        // Custom module resolution
      }
    })
  ]
});
```

## Features

- 🔌 Plug-and-play integration
- ⚡️ Lightning-fast HMR
- 🔧 TypeScript support
- 🗺️ Custom module resolution
- 📦 Optimized production builds
- 🛠️ Development tools

## Options

### `hmr`

Enable Hot Module Replacement for Closure components.

```typescript
closureNextVite({
  hmr: true
})
```

### `paths`

Configure custom module resolution paths.

```typescript
closureNextVite({
  paths: {
    '@components': './src/components'
  }
})
```

## Example Configuration

### Development Mode

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { closureNextVite } from '@closure-next/vite';

export default defineConfig({
  mode: 'development',
  plugins: [
    closureNextVite({
      hmr: true,
      paths: {
        '@closure-next': './node_modules/@closure-next'
      }
    })
  ],
  server: {
    hmr: true
  }
});
```

### Production Mode

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { closureNextVite } from '@closure-next/vite';

export default defineConfig({
  mode: 'production',
  plugins: [
    closureNextVite({
      hmr: false
    })
  ],
  build: {
    target: 'esnext',
    minify: 'terser'
  }
});
```

## TypeScript Support

The plugin includes TypeScript definitions:

```typescript
import { closureNextVite } from '@closure-next/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [
    closureNextVite({
      // Type-checked options
    })
  ]
};
```

## Development Features

### Hot Module Replacement

The plugin automatically handles HMR for Closure components:

```typescript
// Your component will automatically reload when changed
import { Component } from '@closure-next/core';

class MyComponent extends Component {
  // Changes here trigger HMR
}
```

### Development Tools

The plugin integrates with Vite's development tools:

- Source maps for debugging
- Fast refresh
- Error overlay
- Network proxy
- Asset handling

## Production Optimization

The plugin automatically configures production optimizations:

- Code splitting
- Tree shaking
- Minification
- Asset optimization
- Module preloading
