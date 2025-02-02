import { ClosureNextWebpackPlugin } from '../index.js';
import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Stats = webpack.Stats;
type Configuration = webpack.Configuration;
type Compiler = webpack.Compiler;
type WebpackError = Error;

interface WebpackTestOptions {
  treeShaking?: boolean;
  codeSplitting?: boolean;
  paths?: { [key: string]: string };
}

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
  const outputPath = path.resolve(__dirname, 'dist');
  
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

    return new Promise<void>((resolve, reject) => {
      compiler.run((err: WebpackError | null, stats: Stats | undefined) => {
        try {
          if (err) {
            reject(err);
            return;
          }
          if (!stats) {
            reject(new Error('No stats available'));
            return;
          }
          
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
          
          compiler.dispose((err: Error | undefined) => {
            if (err) reject(err);
            else resolve();
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  test('should handle code splitting', async () => {
    const config = createTestConfig({ codeSplitting: true });
    const compiler = webpack(config);

    return new Promise<void>((resolve, reject) => {
      compiler.run((err: WebpackError | null, stats: Stats | undefined) => {
        try {
          if (err) {
            reject(err);
            return;
          }
          if (!stats) {
            reject(new Error('No stats available'));
            return;
          }
          
          expect(stats.hasErrors()).toBe(false);
          expect(fs.existsSync(path.join(outputPath, 'closure-next.bundle.js'))).toBe(true);
          
          compiler.dispose((err: Error | undefined) => {
            if (err) reject(err);
            else resolve();
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  test('should resolve custom module paths', async () => {
    const config = createTestConfig({
      paths: {
        '@test': path.resolve(__dirname, 'fixtures')
      }
    });
    const compiler = webpack(config);

    return new Promise<void>((resolve, reject) => {
      compiler.run((err: WebpackError | null, stats: Stats | undefined) => {
        try {
          if (err) {
            reject(err);
            return;
          }
          if (!stats) {
            reject(new Error('No stats available'));
            return;
          }
          
          expect(stats.hasErrors()).toBe(false);
          
          compiler.dispose((err: Error | undefined) => {
            if (err) reject(err);
            else resolve();
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  });
});
