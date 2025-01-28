/**
 * @fileoverview Webpack plugin for Closure Next.
 * @license Apache-2.0
 */

import { Compiler, WebpackPluginInstance } from 'webpack';

interface ClosureNextWebpackOptions {
  /** Enable code splitting for Closure components */
  codeSplitting?: boolean;
  /** Enable tree shaking optimizations */
  treeShaking?: boolean;
  /** Custom module resolution paths */
  paths?: Record<string, string>;
}

export class ClosureNextWebpackPlugin implements WebpackPluginInstance {
  private options: ClosureNextWebpackOptions;

  constructor(options: ClosureNextWebpackOptions = {}) {
    this.options = {
      codeSplitting: true,
      treeShaking: true,
      ...options
    };
  }

  apply(compiler: Compiler): void {
    // Enable tree shaking
    if (this.options.treeShaking) {
      compiler.options.optimization = compiler.options.optimization || {};
      compiler.options.optimization.usedExports = true;
      compiler.options.optimization.sideEffects = true;
    }

    // Configure module resolution
    compiler.options.resolve = compiler.options.resolve || {};
    compiler.options.resolve.alias = {
      ...compiler.options.resolve.alias,
      ...this.options.paths
    };

    // Handle code splitting
    if (this.options.codeSplitting) {
      compiler.options.optimization = compiler.options.optimization || {};
      compiler.options.optimization.splitChunks = {
        chunks: 'all',
        name: 'closure-next',
        cacheGroups: {
          closureNext: {
            test: /[\\/]node_modules[\\/]@closure-next[\\/]/,
            name: 'closure-next',
            chunks: 'all',
            priority: 10
          }
        }
      };
    }

    // Add loader for Closure components
    compiler.options.module = compiler.options.module || { rules: [] };
    compiler.options.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      ]
    });
  }
}
