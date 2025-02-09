import { useEffect, useRef, useState, useCallback } from 'react';
import { DOMHelper } from '@closure-next/core';
import type { Component } from '@closure-next/core';
import type { RefObject } from 'react';

export function useClosureComponent<T extends Component>(
  ComponentClass: new (domHelper: DOMHelper) => T
): RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);
  const componentRef = useRef<T>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cleanup = useCallback(() => {
    if (componentRef.current && !componentRef.current.isDisposed()) {
      try {
        componentRef.current.dispose();
      } catch (err) {
        console.error('Error cleaning up previous component:', err);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      if (!ref.current || componentRef.current || !mounted) return;

      cleanup(); // Clean up any existing component
      const domHelper = new DOMHelper(document);

      try {
        componentRef.current = new ComponentClass(domHelper);
        await componentRef.current.render(ref.current);
        if (mounted) {
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Error rendering component:', err);
        if (mounted) {
          setError(err as Error);
        }
      }
    };

    // Run setup immediately since we're in a useEffect
    setup().catch(err => {
      if (mounted) {
        console.error('Error in setup:', err);
        setError(err as Error);
      }
    });

    return () => {
      mounted = false;
      cleanup();
    };
  }, [ComponentClass, cleanup]);

  // Throw errors in render phase to trigger error boundaries
  if (error) {
    throw error;
  }

  return ref;
}
