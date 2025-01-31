<script lang="ts">
  import { onMount } from 'svelte';
  import type { ComponentInterface } from '@closure-next/core';

  export let component: new () => ComponentInterface;
  export let props: Record<string, unknown> = {};

  let container: HTMLDivElement;
  let componentInstance: ComponentInterface;

  onMount(() => {
    if (container) {
      componentInstance = new component();
      componentInstance.render(container);

      if (props) {
        Object.entries(props).forEach(([key, value]) => {
          const setter = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          if (typeof componentInstance[setter] === 'function') {
            componentInstance[setter](value);
          }
        });
      }

      // Store reference for testing
      container._closureComponent = componentInstance;
    }

    return () => {
      if (componentInstance) {
        componentInstance.dispose();
      }
    };
  });

  $: if (componentInstance && props) {
    Object.entries(props).forEach(([key, value]) => {
      const setter = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      if (typeof componentInstance[setter] === 'function') {
        componentInstance[setter](value);
      }
    });
  }
</script>

<div bind:this={container} data-testid="closure-wrapper" />
