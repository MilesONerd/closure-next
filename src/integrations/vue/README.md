# Closure Next Vue Integration

Plug-and-play integration between Closure Next components and Vue applications.

## Installation

```bash
npm install @closure-next/vue
```

## Usage

```vue
<script setup lang="ts">
import { useClosureComponent } from '@closure-next/vue';
import { MyClosureComponent } from './my-component';

const { ref, component } = useClosureComponent(MyClosureComponent, {
  // Initial props
  title: 'Hello from Closure Next',
  onClick: () => alert('Clicked!')
});
</script>

<template>
  <div ref="ref"></div>
</template>
```

## Features

- 🔌 Plug-and-play integration
- ⚡️ Full TypeScript support
- 🔄 Reactive props
- 🧹 Automatic cleanup
- 🎯 Direct DOM integration
- 💚 Vue Composition API support

## API Reference

### `useClosureComponent<T extends Component>(ComponentClass, props?)`

A Vue composable that creates and manages a Closure Next component.

#### Parameters

- `ComponentClass`: Constructor - The Closure Next component class
- `props?`: Object - Props to pass to the component

#### Returns

An object containing:
- `ref`: A template ref for the mounting element
- `component`: A ref containing the Closure component instance

## TypeScript Support

```vue
<script setup lang="ts">
import type { Component } from '@closure-next/core';
import { useClosureComponent } from '@closure-next/vue';

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

class MyComponent extends Component {
  // Implementation
}

const { ref, component } = useClosureComponent<MyComponent>(MyComponent, {
  title: 'Hello', // Type-checked
  onClick: () => {} // Type-checked
});
</script>

<template>
  <div ref="ref"></div>
</template>
```

## Vue 3 Composition API

The integration is built specifically for Vue 3's Composition API, providing a clean and type-safe way to use Closure Next components in your Vue applications.

### Example with Composition API

```vue
<script setup lang="ts">
import { watch } from 'vue';
import { useClosureComponent } from '@closure-next/vue';
import { MyClosureComponent } from './my-component';

const props = defineProps<{
  title: string;
}>();

const { ref, component } = useClosureComponent(MyClosureComponent, {
  title: props.title
});

// React to prop changes
watch(() => props.title, (newTitle) => {
  if (component.value) {
    component.value.setTitle(newTitle);
  }
});
</script>

<template>
  <div ref="ref"></div>
</template>
```
