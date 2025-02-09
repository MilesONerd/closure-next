# Closure Next Core API Documentation

## Overview
Closure Next is a modern TypeScript-based reimplementation of the Google Closure Library, designed for seamless integration with contemporary JavaScript frameworks and development workflows.

## Core Modules

### Component System (`component.ts`)
The component system provides the foundation for creating reusable UI components in Closure Next.

#### Key Features
- TypeScript-first component definitions
- Framework-agnostic component base classes
- Lifecycle management
- State handling

### DOM Manipulation (`dom.ts`)
Provides utilities for DOM manipulation and traversal.

#### Key Features
- Type-safe DOM operations
- Cross-browser compatibility
- Performance-optimized selectors
- Event delegation support

### Event System (`events.ts`)
Handles event management and propagation across the application.

#### Key Features
- Type-safe event handling
- Custom event definitions
- Event bubbling control
- Event delegation support

### ID Management (`id.ts`)
Manages unique identifiers for components and DOM elements.

#### Key Features
- Unique ID generation
- ID collision prevention
- Scoped ID management

### Utility Functions

#### Array Utilities (`utils/array.ts`)
Collection of array manipulation utilities.

#### Object Utilities (`utils/object.ts`)
Object manipulation and transformation utilities.

#### String Utilities (`utils/string.ts`)
String manipulation and formatting utilities.

## Type Definitions
The library includes comprehensive TypeScript type definitions for all APIs, ensuring type safety and excellent IDE support.

## Module Format
Closure Next uses ES Modules (ESM) as its primary module format, with CommonJS (CJS) compatibility provided through package.json configuration.

## Package Configuration
- Main entry: `dist/index.js` (CommonJS)
- Module entry: `dist/index.mjs` (ESM)
- Types: `dist/index.d.ts`

## Peer Dependencies
The core package has optional peer dependencies for framework integrations:
- React ≥18.0.0
- Vue ≥3.0.0
- Angular ≥17.0.0
- Svelte ≥4.0.0

These dependencies are marked as optional and only required when using the respective framework integrations.
