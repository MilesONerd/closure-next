import type { Plugin } from 'vite';

interface ClosureNextViteOptions {
  hmr?: boolean;
  paths?: Record<string, string>;
}

export function closureNextVite(options: ClosureNextViteOptions = {}): Plugin {
  const { hmr = true, paths = {} } = options;

  return {
    name: 'closure-next',
    
    config(config) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...config.resolve.alias,
        ...paths
      };
      
      return config;
    },
    
    configureServer(server) {
      if (hmr) {
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
        let transformedCode = code;
        const jsId = id.replace(/\.tsx?$/, '.js');
        
        // Replace .ts extensions with .js in imports and file paths
        transformedCode = transformedCode
          .replace(/from\s+['"]([^'"]+)\.tsx?['"]/g, 'from "$1.js"')
          .replace(/import\s+['"]([^'"]+)\.tsx?['"]/g, 'import "$1.js"');

        if (hmr) {
          transformedCode = `${transformedCode}
            if (import.meta.hot) {
              import.meta.hot.on('closure-next-hmr', ({ file }) => {
                if (file === ${JSON.stringify(jsId)}) {
                  import.meta.hot.invalidate();
                }
              });
            }`;
        }

        return { code: transformedCode, map: null };
      }
      return null;
    }
  };
}
