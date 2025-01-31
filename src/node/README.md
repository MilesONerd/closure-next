# Closure Next Node.js Integration

Node.js compatibility layer for Closure Next, providing server-side rendering capabilities and module system compatibility.

## Installation

```bash
npm install @closure-next/node
```

## Usage

### ESM

```javascript
import { renderToString } from '@closure-next/node';
import { MyComponent } from './my-component';

const html = renderToString(MyComponent, {
  title: 'Server-rendered component'
});
```

### ESM

```typescript
import { renderToString } from '@closure-next/node';
import { MyComponent } from './my-component';

const html = renderToString(MyComponent, {
  title: 'Server-rendered component'
});
```

## Features

- 🖥️ Server-side rendering
- 📦 CommonJS support
- 🔄 ESM compatibility
- ⚡️ Full TypeScript support
- 🧹 Automatic cleanup

## API Reference

### `renderToString(ComponentClass, props?)`

Renders a Closure Next component to an HTML string.

#### Parameters

- `ComponentClass`: Constructor - The Closure Next component class
- `props?`: Object - Props to pass to the component

#### Returns

A string containing the rendered HTML.

## TypeScript Support

```typescript
import { renderToString } from '@closure-next/node';
import type { Component } from '@closure-next/core';

interface MyComponentProps {
  title: string;
}

class MyComponent extends Component {
  // Implementation
}

const html = renderToString<MyComponent>(MyComponent, {
  title: 'Hello' // Type-checked
});
```

## Server-Side Usage

### Express Example

```typescript
import express from 'express';
import { renderToString } from '@closure-next/node';
import { MyComponent } from './my-component';

const app = express();

app.get('/', (req, res) => {
  const html = renderToString(MyComponent, {
    title: 'Server-rendered page'
  });
  
  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        ${html}
      </body>
    </html>
  `);
});
```

### Next.js API Route Example

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderToString } from '@closure-next/node';
import { MyComponent } from './my-component';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const html = renderToString(MyComponent, {
    title: 'API-rendered component'
  });
  
  res.status(200).json({ html });
}
```
