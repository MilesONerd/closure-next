<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { closureComponent } from '../../index';
  import type { Component } from '@closure-next/core';
  import type { SvelteComponent } from 'svelte';

  export let component: new () => Component;
  export let props: Record<string, unknown> = {};

  let wrapper: ReturnType<typeof closureComponent>;
  let container: HTMLDivElement;
  const dispatch = createEventDispatcher();

  $: if (wrapper && props) {
    Object.entries(props).forEach(([key, value]) => {
      wrapper.$set({ [key]: value });
    });
  }

  onMount(() => {
    wrapper = closureComponent({
      target: container,
      component,
      props
    });

    dispatch('mount', { wrapper });
  });

  onDestroy(() => {
    if (wrapper) {
      wrapper.$destroy();
    }
  });

  export function getWrapper(): SvelteComponent {
    return wrapper;
  }
</script>

<div bind:this={container} data-testid="closure-wrapper"></div>
