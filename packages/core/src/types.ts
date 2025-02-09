import type { Component } from './component';
import type { DomHelper } from './dom';
import type { EventHandler } from './events';
import type { LazyLoadOptions, ModuleCache } from './lazy';
import type { Cache, ComponentPool, ResourcePreloader } from './cache';
import type { ChunkConfig, BundleConfig } from './bundle';

export type {
  Component,
  ComponentProps,
  DomHelper,
  EventHandler,
  LazyLoadOptions,
  ModuleCache,
  Cache,
  ComponentPool,
  ResourcePreloader,
  ChunkConfig,
  BundleConfig
};

export interface ComponentProps {
  [key: string]: any;
}
