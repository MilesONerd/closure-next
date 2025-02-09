/**
 * @fileoverview Rollup plugin for Closure Next.
 * @license Apache-2.0
 */

import type { Plugin } from 'rollup';
import { createFilter } from '@rollup/pluginutils';

interface ClosureNextRollupOptions {
  /** Enable code splitting */
  codeSplitting?: boolean;
  /** Custom module resolution paths */
  paths?: Record<string, string>;
  /** Enable tree shaking optimizations */
  treeShaking?: boolean;
  /** Enable minification */
  minify?: boolean;
  /** Files to include */
  include?: string[];
  /** Files to exclude */
  exclude?: string[];
}

export function closureNextRollup(options: ClosureNextRollupOptions = {}): Plugin {
  const { 
    paths = {},
    treeShaking = true,
    minify = true,
    include = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    exclude = ['node_modules/**']
  } = options;

  const filter = createFilter(include, exclude);

  return {
    name: 'closure-next',

    resolveId(source, importer) {
      for (const [alias, path] of Object.entries(paths)) {
        if (source.startsWith(alias)) {
          return source.replace(alias, path);
        }
      }
      return null;
    },

    transform(code: string, id: string) {
      if (!filter(id)) return null;

      // Handle TypeScript files
      if (id.endsWith('.ts') || id.endsWith('.tsx')) {
        // Keep the original code for TypeScript files
        return {
          code,
          map: null
        };
      }

      // Tree shaking optimization
      if (treeShaking) {
        // Remove unused exports
        code = code.replace(/export\s+(?:const|let|var|function|class)\s+\w+[^;]*;\s*/g, '');
        // Remove unused imports
        code = code.replace(/import\s+{\s*[^}]+}\s+from\s+['"][^'"]+['"];\s*/g, '');
      }

      // Minification
      if (minify) {
        // Remove comments
        code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        // Remove whitespace
        code = code.replace(/\s+/g, ' ');
        // Remove unnecessary semicolons
        code = code.replace(/;+/g, ';');
        // Remove unnecessary brackets
        code = code.replace(/{\s+}/g, '{}');
      }

      return {
        code,
        map: null
      };
    },

    renderChunk(code: string) {
      if (!minify) return null;

      // Final minification pass
      code = code
        .replace(/\s+/g, ' ')
        .replace(/;\s+/g, ';')
        .replace(/{\s+/g, '{')
        .replace(/}\s+/g, '}')
        .replace(/,\s+/g, ',')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*=\s*/g, '=')
        .replace(/\s*\+\s*/g, '+')
        .replace(/\s*-\s*/g, '-')
        .replace(/\s*\*\s*/g, '*')
        .replace(/\s*\/\s*/g, '/');

      return {
        code,
        map: null
      };
    }
  };
}
