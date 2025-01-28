# Closure Next Webpack Plugin

Webpack integration for Closure Next, providing optimized bundling and code splitting.

## Installation

```bash
npm install @closure-next/webpack
```

## Usage

```javascript
// webpack.config.js
const { ClosureNextWebpackPlugin } = require('@closure-next/webpack');

module.exports = {
  // ... other webpack config
  plugins: [
    new ClosureNextWebpackPlugin({
      codeSplitting: true,
      treeShaking: true,
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
- 🌳 Tree shaking optimization
- 🔧 TypeScript support
- 🗺️ Custom module resolution
- ⚡️ Development optimization

## Options

### `codeSplitting`

Enable code splitting for Closure components.

```javascript
new ClosureNextWebpackPlugin({
  codeSplitting: true
})
```

### `treeShaking`

Enable tree shaking optimizations.

```javascript
new ClosureNextWebpackPlugin({
  treeShaking: true
})
```

### `paths`

Configure custom module resolution paths.

```javascript
new ClosureNextWebpackPlugin({
  paths: {
    '@components': './src/components'
  }
})
```

## Example Configuration

```javascript
// webpack.config.js
const { ClosureNextWebpackPlugin } = require('@closure-next/webpack');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new ClosureNextWebpackPlugin({
      codeSplitting: true,
      treeShaking: true,
      paths: {
        '@closure-next': path.resolve(__dirname, 'node_modules/@closure-next')
      }
    })
  ]
};
```

## Development Mode

The plugin automatically configures development-friendly settings:

```javascript
// webpack.config.dev.js
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new ClosureNextWebpackPlugin()
  ]
};
```

## Production Mode

Optimized settings for production:

```javascript
// webpack.config.prod.js
module.exports = {
  mode: 'production',
  plugins: [
    new ClosureNextWebpackPlugin({
      codeSplitting: true,
      treeShaking: true
    })
  ]
};
```

## TypeScript Support

The plugin includes TypeScript definitions:

```typescript
import { ClosureNextWebpackPlugin } from '@closure-next/webpack';

const config: webpack.Configuration = {
  plugins: [
    new ClosureNextWebpackPlugin({
      // Type-checked options
    })
  ]
};
```
