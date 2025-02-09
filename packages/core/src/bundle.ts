/**
 * Bundle optimization utilities
 */

export interface ChunkConfig {
  name: string;
  test: RegExp;
  priority: number;
}

export const defaultChunks: ChunkConfig[] = [
  {
    name: 'framework',
    test: /[\\/]node_modules[\\/](react|vue|angular|svelte)[\\/]/,
    priority: 40
  },
  {
    name: 'core',
    test: /[\\/]packages[\\/]core[\\/]/,
    priority: 30
  },
  {
    name: 'wasm',
    test: /\.wasm$/,
    priority: 20
  },
  {
    name: 'vendor',
    test: /[\\/]node_modules[\\/]/,
    priority: 10
  }
];

export interface BundleConfig {
  chunks?: ChunkConfig[];
  minChunkSize?: number;
  maxAsyncRequests?: number;
  maxInitialRequests?: number;
}

/**
 * Creates a webpack configuration for optimized bundling
 */
export function createBundleConfig(config: BundleConfig = {}): any {
  const {
    chunks = defaultChunks,
    minChunkSize = 20000,
    maxAsyncRequests = 30,
    maxInitialRequests = 30
  } = config;

  return {
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: minChunkSize,
        maxAsyncRequests,
        maxInitialRequests,
        cacheGroups: chunks.reduce((acc, chunk) => {
          acc[chunk.name] = {
            test: chunk.test,
            priority: chunk.priority,
            reuseExistingChunk: true
          };
          return acc;
        }, {} as any)
      }
    }
  };
}

/**
 * Creates a rollup configuration for optimized bundling
 */
export function createRollupConfig(config: BundleConfig = {}): any {
  const {
    chunks = defaultChunks,
    minChunkSize = 20000
  } = config;

  return {
    output: {
      manualChunks(id: string) {
        for (const chunk of chunks) {
          if (chunk.test.test(id)) {
            return chunk.name;
          }
        }
      }
    }
  };
}
