/**
 * Lazy loading utilities for Closure Next components and modules
 */

export interface LazyLoadOptions {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: number) => void;
}

const DEFAULT_OPTIONS: LazyLoadOptions = {
  timeout: 30000,
  retries: 3
};

/**
 * Lazy loads a component with configurable options
 */
export async function lazyLoad<T>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = DEFAULT_OPTIONS
): Promise<T> {
  const { timeout, retries, onProgress } = { ...DEFAULT_OPTIONS, ...options };
  let attempt = 0;
  
  while (attempt < (retries || 1)) {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Lazy load timeout')), timeout);
      });
      
      const loadPromise = importFn().then(module => {
        onProgress?.(1);
        return module.default;
      });
      
      return await Promise.race([loadPromise, timeoutPromise]) as T;
    } catch (error) {
      attempt++;
      onProgress?.(0);
      
      if (attempt >= (retries || 1)) {
        throw error;
      }
    }
  }
  
  throw new Error('Failed to lazy load component');
}

/**
 * Creates a lazy loadable version of a component
 */
export function createLazyComponent<T>(importFn: () => Promise<{ default: T }>) {
  let loadedComponent: T | null = null;
  let loadPromise: Promise<T> | null = null;
  
  return {
    get: async (options?: LazyLoadOptions) => {
      if (loadedComponent) {
        return loadedComponent;
      }
      
      if (!loadPromise) {
        loadPromise = lazyLoad(importFn, options);
      }
      
      loadedComponent = await loadPromise;
      return loadedComponent;
    },
    preload: (options?: LazyLoadOptions) => {
      if (!loadPromise) {
        loadPromise = lazyLoad(importFn, options);
      }
      return loadPromise;
    }
  };
}

/**
 * Cache for lazy loaded modules
 */
export class ModuleCache {
  private static instance: ModuleCache;
  private cache: Map<string, any> = new Map();
  
  private constructor() {}
  
  static getInstance(): ModuleCache {
    if (!ModuleCache.instance) {
      ModuleCache.instance = new ModuleCache();
    }
    return ModuleCache.instance;
  }
  
  async get<T>(key: string, loader: () => Promise<T>): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const module = await loader();
    this.cache.set(key, module);
    return module;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

/**
 * Creates a cached lazy loadable module
 */
export function createLazyModule<T>(
  key: string,
  importFn: () => Promise<{ default: T }>,
  options?: LazyLoadOptions
) {
  const cache = ModuleCache.getInstance();
  
  return {
    get: () => cache.get(key, () => lazyLoad(importFn, options)),
    preload: () => cache.get(key, () => lazyLoad(importFn, options))
  };
}
