# Closure Next Rollup Plugin

Rollup integration for Closure Next, providing efficient bundling and code splitting.

## Installation

```bash
npm install @closure-next/rollup
```

## Usage

```javascript
// rollup.config.js
import { closureNextRollup } from '@closure-next/rollup';

export default {
  input: 'src/index.ts',
  plugins: [
    closureNextRollup({
      codeSplitting: true,
      paths: {
        // Custom module resolution
      }
    })
  ]
};
```

## Features

- 🔌 Plug-and-play integration
- 📦 Automatic code splitting
- 🗺️ Custom module resolution
- 🔧 TypeScript support
- ⚡️ Efficient bundling
- 🛠️ Development tools

## Options

### `codeSplitting`

Enable code splitting for Closure components.

```javascript
closureNextRollup({
  codeSplitting: true
})
```

### `paths`

Configure custom module resolution paths.

```javascript
closureNextRollup({
  paths: {
    '@components': './src/components'
  }
})
```

## Example Configuration

### Development Mode

```javascript
// rollup.config.js
import { closureNextRollup } from '@closure-next/rollup';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    typescript(),
    closureNextRollup({
      codeSplitting: true,
      paths: {
        '@closure-next': './node_modules/@closure-next'
      }
    })
  ]
};
```

### Production Mode

```javascript
// rollup.config.js
import { closureNextRollup } from '@closure-next/rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: false
  },
  plugins: [
    typescript(),
    closureNextRollup({
      codeSplitting: true
    }),
    terser()
  ]
};
```

## TypeScript Support

The plugin includes TypeScript definitions:

```typescript
import { closureNextRollup } from '@closure-next/rollup';
import type { RollupOptions } from 'rollup';

const config: RollupOptions = {
  plugins: [
    closureNextRollup({
      // Type-checked options
    })
  ]
};
```

## Code Splitting

The plugin automatically handles code splitting for Closure components:

```typescript
// Your code
import { Component } from '@closure-next/core';

// Dynamic imports are automatically code-split
const MyComponent = await import('./components/MyComponent');
```

## Module Resolution

Custom module resolution paths can be configured:

```javascript
closureNextRollup({
  paths: {
    '@components': './src/components',
    '@utils': './src/utils'
  }
})
```

This allows imports like:

```typescript
import { MyComponent } from '@components/MyComponent';
import { utils } from '@utils/index';
```

## Development Tools

The plugin supports various development features:

- Source maps for debugging
- Watch mode
- Fast builds
- Tree shaking
- Asset handling

## Production Optimization

The plugin automatically configures production optimizations:

- Code splitting
- Tree shaking
- Dead code elimination
- Module concatenation
