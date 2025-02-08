<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Component } from '@closure-next/core';

  export let component: Component;
  let container: HTMLDivElement;

  onMount(() => {
    if (container) {
      component.enterDocument();
      const element = component.getElement();
      if (element) {
        container.appendChild(element);
      }
    }
  });

  onDestroy(() => {
    if (container) {
      component.exitDocument();
    }
  });
</script>

<div bind:this={container} data-testid="closure-wrapper" />
