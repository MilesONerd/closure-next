export interface Cache<T> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
  clear(): void;
}

export interface ComponentPool<T> {
  acquire(): T | undefined;
  release(component: T): void;
  clear(): void;
}

export interface ResourcePreloader {
  preloadScript(url: string): Promise<void>;
  preloadStyle(url: string): Promise<void>;
  isLoaded(url: string): boolean;
}

export class CacheManager<T> implements Cache<T> {
  private cache: Map<string, T> = new Map();
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = Array.from(this.cache.keys())[0];
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}
