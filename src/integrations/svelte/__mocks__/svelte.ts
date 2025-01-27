// Mock Svelte module
interface SvelteLifecycle {
  onMount: Array<() => void | (() => void)>;
  onDestroy: Array<() => void>;
  beforeUpdate: Array<() => void>;
  afterUpdate: Array<() => void>;
}

let currentComponent: SvelteComponent | null = null;
const lifecycles = new WeakMap<SvelteComponent, SvelteLifecycle>();

function ensureLifecycle(component: SvelteComponent): SvelteLifecycle {
  if (!lifecycles.has(component)) {
    lifecycles.set(component, {
      onMount: [],
      onDestroy: [],
      beforeUpdate: [],
      afterUpdate: []
    });
  }
  return lifecycles.get(component)!;
}

export function onMount(fn: () => void | (() => void)): void {
  if (!currentComponent) {
    throw new Error('onMount can only be called during component initialization');
  }
  const lifecycle = ensureLifecycle(currentComponent);
  lifecycle.onMount.push(fn);
}

export function onDestroy(fn: () => void): void {
  if (!currentComponent) {
    throw new Error('onDestroy can only be called during component initialization');
  }
  const lifecycle = ensureLifecycle(currentComponent);
  lifecycle.onDestroy.push(fn);
}

export function beforeUpdate(fn: () => void): void {
  if (!currentComponent) {
    throw new Error('beforeUpdate can only be called during component initialization');
  }
  const lifecycle = ensureLifecycle(currentComponent);
  lifecycle.beforeUpdate.push(fn);
}

export function afterUpdate(fn: () => void): void {
  if (!currentComponent) {
    throw new Error('afterUpdate can only be called during component initialization');
  }
  const lifecycle = ensureLifecycle(currentComponent);
  lifecycle.afterUpdate.push(fn);
}

export class SvelteComponent {
  public target: HTMLElement;
  public props: Record<string, unknown>;
  private closureComponent: any;
  private mounted = false;

  constructor(options: { target: HTMLElement; props?: Record<string, unknown> }) {
    currentComponent = this;
    this.target = options.target;
    this.props = options.props || {};
    
    // Store reference to any existing Closure component
    if ((this.target as any)._closureComponent) {
      this.closureComponent = (this.target as any)._closureComponent;
    }

    // Initialize lifecycle
    ensureLifecycle(this);
    
    // Schedule mount
    Promise.resolve().then(() => this.mount());
    
    currentComponent = null;
  }

  private async mount(): Promise<void> {
    if (this.mounted) return;
    this.mounted = true;

    const lifecycle = lifecycles.get(this)!;
    
    // Run mount callbacks
    for (const fn of lifecycle.onMount) {
      try {
        const cleanup = await fn();
        if (typeof cleanup === 'function') {
          lifecycle.onDestroy.push(cleanup);
        }
      } catch (e) {
        console.error('Error in onMount:', e);
      }
    }
  }

  $set(props: Record<string, unknown>): void {
    const lifecycle = lifecycles.get(this)!;
    
    // Run beforeUpdate callbacks
    lifecycle.beforeUpdate.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error('Error in beforeUpdate:', e);
      }
    });

    Object.assign(this.props, props);
    if (this.closureComponent) {
      Object.entries(props).forEach(([key, value]) => {
        const setter = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof this.closureComponent[setter] === 'function') {
          this.closureComponent[setter](value);
        } else if (typeof this.closureComponent[key] === 'function') {
          this.closureComponent[key](value);
        } else {
          (this.closureComponent as any)[key] = value;
        }
      });
    }

    // Run afterUpdate callbacks
    lifecycle.afterUpdate.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error('Error in afterUpdate:', e);
      }
    });
  }

  $destroy(): void {
    const lifecycle = lifecycles.get(this);
    if (!lifecycle) return;

    // Run destroy callbacks
    lifecycle.onDestroy.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error('Error in onDestroy:', e);
      }
    });

    // Clean up Closure component
    if (this.closureComponent && typeof this.closureComponent.dispose === 'function') {
      this.closureComponent.dispose();
    }
    
    // Clean up DOM
    this.target.innerHTML = '';
    
    // Clean up references
    delete (this.target as any)._closureComponent;
    this.closureComponent = null;
    lifecycles.delete(this);
  }

  $$: {
    flush: () => void;
  } = {
    flush: () => {
      const lifecycle = lifecycles.get(this)!;
      
      // Run beforeUpdate callbacks
      lifecycle.beforeUpdate.forEach(fn => {
        try {
          fn();
        } catch (e) {
          console.error('Error in beforeUpdate:', e);
        }
      });

      // Re-apply all props to trigger updates
      if (this.closureComponent) {
        Object.entries(this.props).forEach(([key, value]) => {
          const setter = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          if (typeof this.closureComponent[setter] === 'function') {
            this.closureComponent[setter](value);
          } else if (typeof this.closureComponent[key] === 'function') {
            this.closureComponent[key](value);
          }
        });
      }

      // Run afterUpdate callbacks
      lifecycle.afterUpdate.forEach(fn => {
        try {
          fn();
        } catch (e) {
          console.error('Error in afterUpdate:', e);
        }
      });
    }
  };
}

export type ComponentType<T extends SvelteComponent = SvelteComponent> = new (options: { target: HTMLElement; props?: Record<string, unknown> }) => T;

export function createEventDispatcher<T = any>() {
  return function dispatch(type: string, detail?: T) {
    const event = new CustomEvent(type, { detail });
    return event;
  };
}

export async function tick(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 0));
}
