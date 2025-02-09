import { Component, ComponentState, ComponentInterface } from '@closure-next/core/dist/index.js';
import { Ref, ShallowRef } from 'vue';

/**
 * Vue-specific component reference type
 */
export interface ClosureComponentRef<T extends Component = Component> {
  ref: Ref<HTMLElement | null>;
  component: ShallowRef<T | null>;
  setProps: (props: Partial<ComponentState>) => Promise<void>;
}

/**
 * Vue component options type
 */
export interface ClosureComponentOptions<T extends Component = Component> {
  props?: ComponentState;
  onMounted?: (component: T) => void;
  onUnmounted?: (component: T) => void;
  onError?: (error: Error) => void;
}

/**
 * Component instance type with Vue-specific features
 */
export type ClosureInstance<T extends Component = Component> = T & ComponentInterface;
