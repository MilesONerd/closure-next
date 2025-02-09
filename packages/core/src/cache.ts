/**
 * Component and resource caching system
 */

export interface CacheOptions {
  maxSize?: number;
  ttl?: number;
}

export class Cache<T> {
  private cache: Map<string, { value: T; timestamp: number }> = new Map();
  private maxSize: number;
  private ttl: number;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100;
    this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutes default
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Component instance pool for reuse
 */
export class ComponentPool<T> {
  private pool: T[] = [];
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  acquire(): T | undefined {
    return this.pool.pop();
  }

  release(component: T): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(component);
    }
  }

  clear(): void {
    this.pool = [];
  }
}

/**
 * Resource preloader for optimizing load times
 */
export class ResourcePreloader {
  private loadedResources: Set<string> = new Set();
  private loading: Map<string, Promise<void>> = new Map();

  async preloadScript(url: string): Promise<void> {
    if (this.loadedResources.has(url)) return;
    
    if (!this.loading.has(url)) {
      const loadPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => {
          this.loadedResources.add(url);
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
      
      this.loading.set(url, loadPromise);
    }

    return this.loading.get(url);
  }

  async preloadStyle(url: string): Promise<void> {
    if (this.loadedResources.has(url)) return;
    
    if (!this.loading.has(url)) {
      const loadPromise = new Promise<void>((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => {
          this.loadedResources.add(url);
          resolve();
        };
        link.onerror = reject;
        document.head.appendChild(link);
      });
      
      this.loading.set(url, loadPromise);
    }

    return this.loading.get(url);
  }

  isLoaded(url: string): boolean {
    return this.loadedResources.has(url);
  }
}

export const globalCache = new Cache();
export const globalComponentPool = new ComponentPool();
export const globalResourcePreloader = new ResourcePreloader();
