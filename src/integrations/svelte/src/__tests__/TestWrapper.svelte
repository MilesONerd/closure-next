<script lang="ts">
  import type { Component } from '@closure-next/core';
  import { onMount, onDestroy } from 'svelte';

  export let component: Component;
  let container: HTMLDivElement;

  onMount(() => {
    const element = component.getElement();
    if (element && container) {
      container.appendChild(element);
    }
  });

  onDestroy(() => {
    const element = component.getElement();
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
</script>

<div bind:this={container} data-testid="closure-wrapper" />
