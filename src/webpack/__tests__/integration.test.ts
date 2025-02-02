import { ClosureNextWebpackPlugin } from '../index.js';
import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, 'dist');

type Stats = webpack.Stats;
type Configuration = webpack.Configuration;
type Compiler = webpack.Compiler;
type WebpackError = Error;

interface WebpackTestOptions {
  treeShaking?: boolean;
  codeSplitting?: boolean;
  paths?: { [key: string]: string };
}

const runWebpackCompiler = async (compiler: Compiler): Promise<Stats> => {
  return new Promise<Stats>((resolve, reject) => {
    compiler.run((err: WebpackError | null, stats: Stats | undefined) => {
      if (err) reject(err);
      else if (!stats) reject(new Error('No stats available'));
      else resolve(stats);
    });
  });
};

const cleanupCompiler = async (compiler: Compiler): Promise<void> => {
  if ('close' in compiler) {
    await new Promise<void>((resolve, reject) => {
      (compiler as any).close((err: Error | undefined) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

const createTestConfig = (options: WebpackTestOptions = {}): Configuration => ({
  mode: 'production',
  entry: path.resolve(__dirname, 'fixtures/app.ts'),
  output: {
    path: outputPath,
    filename: options.codeSplitting ? '[name].bundle.js' : 'bundle.js',
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  },
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true,
    sideEffects: false,
    concatenateModules: true,
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        closureNext: {
          test: /[\\/]node_modules[\\/]@closure-next[\\/]/,
          name: 'closure-next',
          chunks: 'all',
          enforce: true,
          priority: 10
        }
      }
    }
  },
  resolve: {
    extensions: ['.ts', '.js', '.mjs'],
    alias: {
      '@closure-next/core': path.resolve(__dirname, '../../../packages/core/src'),
      ...(options.paths || {})
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, '../tsconfig.json'),
            transpileOnly: true
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ClosureNextWebpackPlugin(options)
  ]
});

describe('Webpack Integration', () => {
  beforeEach(() => {
    // Clean up output directory
    if (fs.existsSync(outputPath)) {
      fs.rmSync(outputPath, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up output directory
    if (fs.existsSync(outputPath)) {
      fs.rmSync(outputPath, { recursive: true });
    }
  });

  test('should compile with tree shaking enabled', async () => {
    const config = createTestConfig({ treeShaking: true });
    const compiler = webpack(config);

    try {
      const stats = await runWebpackCompiler(compiler);
      
      if (stats.hasErrors()) {
        console.error('Webpack compilation errors:', stats.toString({
          colors: true,
          chunks: false,
          modules: false
        }));
      }
      
      expect(stats.hasErrors()).toBe(false);
      const output = fs.readFileSync(path.join(outputPath, 'bundle.js'), 'utf-8');
      expect(output).not.toContain('unused_export');
    } finally {
      await cleanupCompiler(compiler);
    }
  });

  test('should handle code splitting', async () => {
    const config = createTestConfig({ codeSplitting: true });
    const compiler = webpack(config);

    try {
      const stats = await runWebpackCompiler(compiler);
      expect(stats.hasErrors()).toBe(false);
      expect(fs.existsSync(path.join(outputPath, 'closure-next.bundle.js'))).toBe(true);
    } finally {
      await cleanupCompiler(compiler);
    }
  });

  test('should resolve custom module paths', async () => {
    const config = createTestConfig({
      paths: {
        '@test': path.resolve(__dirname, 'fixtures')
      }
    });
    const compiler = webpack(config);

    try {
      const stats = await runWebpackCompiler(compiler);
      expect(stats.hasErrors()).toBe(false);
    } finally {
      await cleanupCompiler(compiler);
    }
  });
});
