import { useEffect, useRef, useState, useCallback } from 'react';
import type { Component, ComponentState, EventInterface, EventTargetInterface, DOMHelper } from '@closure-next/core';
import { EventType } from '@closure-next/core';

export function useClosureState<T extends ComponentState>(component: Component): [T, (state: Partial<T>) => void] {
  const [state, setState] = useState<T>(component.getState() as T);

  useEffect(() => {
    const handleStateChange = (event: EventInterface) => {
      if (event.type === 'statechange') {
        setState(event.data as T);
      }
    };

    component.addEventListener('statechange', handleStateChange);
    return () => {
      component.removeEventListener('statechange', handleStateChange);
    };
  }, [component]);

  const updateState = useCallback((newState: Partial<T>) => {
    component.setState(newState);
  }, [component]);

  return [state, updateState];
}

export function useClosureEffect(component: Component, effect: () => void | (() => void), deps: any[] = []) {
  useEffect(() => {
    const cleanup = effect();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
      if (!component.isDisposed()) {
        component.dispose();
      }
    };
  }, [component, effect, ...deps]);
}

export function useClosureRef<T extends Component>(component: T): React.RefObject<T> {
  const ref = useRef<T>(component);
  
  useEffect(() => {
    ref.current = component;
    return () => {
      if (ref.current && !ref.current.isDisposed()) {
        ref.current.dispose();
      }
    };
  }, [component]);

  return ref;
}

export function useClosureCallback<T extends (...args: any[]) => any>(
  component: Component,
  callback: T,
  deps: any[] = []
): T {
  return useCallback((...args: Parameters<T>) => {
    if (!component.isDisposed()) {
      return callback(...args);
    }
  }, [component, callback, ...deps]) as T;
}

export function useClosureMount(component: Component, onMount?: () => void) {
  useEffect(() => {
    if (onMount) {
      onMount();
    }
    return () => {
      if (!component.isDisposed()) {
        component.dispose();
      }
    };
  }, [component, onMount]);
}

export function useClosureContext<T extends Component>(component: T) {
  const [context, setContext] = useState<T>(component);

  useEffect(() => {
    setContext(component);
    return () => {
      if (!component.isDisposed()) {
        component.dispose();
      }
    };
  }, [component]);

  return context;
}
