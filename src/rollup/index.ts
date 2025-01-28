/**
 * @fileoverview Rollup plugin for Closure Next.
 * @license Apache-2.0
 */

import type { Plugin } from 'rollup';

interface ClosureNextRollupOptions {
  /** Enable code splitting */
  codeSplitting?: boolean;
  /** Custom module resolution paths */
  paths?: Record<string, string>;
}

export function closureNextRollup(options: ClosureNextRollupOptions = {}): Plugin {
  const { codeSplitting = true, paths = {} } = options;

  return {
    name: 'closure-next',

    resolveId(source, importer) {
      // Handle custom module resolution
      for (const [alias, path] of Object.entries(paths)) {
        if (source.startsWith(alias)) {
          return source.replace(alias, path);
        }
      }
      return null;
    },

    transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.tsx')) {
        // Add code splitting support
        if (codeSplitting) {
          return {
            code: `${code}
              // Enable code splitting for dynamic imports
              if (import.meta.ROLLUP_FILE_URL_${id}) {
                const url = import.meta.ROLLUP_FILE_URL_${id};
                import(url);
              }`,
            map: null
          };
        }
      }
      return null;
    },

    outputOptions(options) {
      // Configure output options for code splitting
      if (codeSplitting) {
        return {
          ...options,
          manualChunks(id) {
            if (id.includes('node_modules/@closure-next')) {
              return 'closure-next';
            }
          }
        };
      }
      return options;
    }
  };
}
