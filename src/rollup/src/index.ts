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
  const { paths = {} } = options;

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

    transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.tsx')) {
        return {
          code: code
            .replace(/\.ts(['"])/g, '.js$1')
            .replace(/from\s+['"]([^'"]+)\.ts['"]/g, 'from "$1.js"'),
          map: null
        };
      }
      return null;
    }
  };
}
