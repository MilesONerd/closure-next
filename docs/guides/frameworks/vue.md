# Vue Integration Guide

## Installation

```bash
npm install @closure-next/vue @closure-next/core
```

## Basic Usage

```vue
<template>
  <ClosureComponent 
    :component="MyComponent"
    :props="{ title: 'Hello World' }"
  />
</template>

<script setup>
import { ClosureComponent } from '@closure-next/vue';
import { MyComponent } from './MyComponent';
</script>
```

## Server-Side Rendering

### Nuxt.js Setup

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@closure-next/nuxt']
});
```

### Hydration Strategies

```vue
<!-- Progressive hydration -->
<ClosureComponent 
  :component="MyComponent"
  hydration="progressive"
  :props="{ title: 'Hello World' }"
/>

<!-- Server-first hydration -->
<ClosureComponent 
  :component="MyComponent"
  hydration="server-first"
  :props="{ title: 'Hello World' }"
/>

<!-- Client-only rendering -->
<ClosureComponent 
  :component="MyComponent"
  hydration="client-only"
  :props="{ title: 'Hello World' }"
/>
```

## Performance Optimization

### WebAssembly Integration

```vue
<template>
  <ClosureWasm v-slot="{ ready }">
    <ClosureComponent 
      v-if="ready"
      :component="MyComponent"
      :wasm="true"
      :props="{ title: 'Hello World' }"
    />
    <div v-else>Loading WebAssembly...</div>
  </ClosureWasm>
</template>

<script setup>
import { ClosureComponent, ClosureWasm } from '@closure-next/vue';
import { MyComponent } from './MyComponent';
</script>
```

### Component Pooling

```vue
<template>
  <div>
    <ClosureComponent
      v-for="item in items"
      :key="item.id"
      :component="MyComponent"
      :pool="pool"
      :props="item"
    />
  </div>
</template>

<script setup>
import { useComponentPool } from '@closure-next/vue';
import { MyComponent } from './MyComponent';

const props = defineProps<{
  items: Array<any>
}>();

const pool = useComponentPool(MyComponent, {
  initialSize: 10,
  maxSize: props.items.length
});
</script>
```

## Testing

```typescript
import { mount } from '@vue/test-utils';
import { ClosureComponent } from '@closure-next/vue';
import { createTestComponent } from '@closure-next/testing';

test('MyComponent renders correctly', () => {
  const wrapper = mount(ClosureComponent, {
    props: {
      component: MyComponent,
      props: { title: 'Test' }
    }
  });
  
  expect(wrapper.text()).toContain('Test');
});
```
