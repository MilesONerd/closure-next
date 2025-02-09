import { Component } from './component';
import { DomHelper } from './dom';

// Component Types
export type { Component, DomHelper };

export interface ComponentProps {
  [key: string]: any;
}

export interface ComponentStateInterface {
  [key: string]: any;
}

// State flags as enum (not type)
export enum ComponentStateFlags {
  UNINITIALIZED = 0,
  INITIALIZING = 1,
  INITIALIZED = 2,
  RENDERING = 3,
  RENDERED = 4,
  DISPOSING = 5,
  DISPOSED = 6
}

// Event Types
export interface ComponentEventMap {
  [key: string]: any;
}

export type EventHandler<T = any> = (event: T) => void;

// Lazy Loading Types
export interface LazyLoadOptions {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: number) => void;
}

export interface ModuleCache {
  get<T>(key: string, loader: () => Promise<T>): Promise<T>;
  clear(): void;
}

// Cache Types
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

// Bundle Types
export interface ChunkConfig {
  name: string;
  test: RegExp;
  priority: number;
}

export interface BundleConfig {
  chunks?: ChunkConfig[];
  minChunkSize?: number;
  maxAsyncRequests?: number;
  maxInitialRequests?: number;
}
