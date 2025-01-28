/**
 * @fileoverview Vite plugin for Closure Next.
 * @license Apache-2.0
 */

import type { Plugin } from 'vite';

interface ClosureNextViteOptions {
  /** Enable HMR for Closure components */
  hmr?: boolean;
  /** Custom module resolution paths */
  paths?: Record<string, string>;
}

export function closureNextVite(options: ClosureNextViteOptions = {}): Plugin {
  const { hmr = true, paths = {} } = options;

  return {
    name: 'closure-next',
    
    config(config) {
      // Configure module resolution
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...config.resolve.alias,
        ...paths
      };
      
      return config;
    },
    
    configureServer(server) {
      if (hmr) {
        // Handle HMR for Closure components
        server.watcher.on('change', async (file) => {
          if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            const module = await server.moduleGraph.getModuleByUrl(file);
            if (module) {
              server.ws.send({
                type: 'custom',
                event: 'closure-next-hmr',
                data: { file }
              });
            }
          }
        });
      }
    },
    
    transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.tsx')) {
        // Add HMR runtime code if enabled
        if (hmr) {
          return {
            code: `${code}
              if (import.meta.hot) {
                import.meta.hot.on('closure-next-hmr', ({ file }) => {
                  if (file === ${JSON.stringify(id)}) {
                    import.meta.hot.invalidate();
                  }
                });
              }`,
            map: null
          };
        }
      }
      return null;
    }
  };
}
