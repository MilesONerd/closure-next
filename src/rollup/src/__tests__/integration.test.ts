import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { closureNextRollup } from '../../src/index.js';
import { rollup, type Plugin, type TransformPluginContext, type SourceDescription, type ResolvedId, type PluginContext, type SourceMap } from 'rollup';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { mockPluginContext } from './mockPluginContext.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputPath = path.resolve(__dirname, '../dist');
const fixturesPath = path.resolve(__dirname, 'fixtures');

describe('Rollup Integration', () => {
  beforeEach(() => {
    if (fs.existsSync(outputPath)) {
      fs.rmSync(outputPath, { recursive: true });
    }
    if (!fs.existsSync(fixturesPath)) {
      fs.mkdirSync(fixturesPath, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(outputPath)) {
      fs.rmSync(outputPath, { recursive: true });
    }
  });

  test('should handle config', async () => {
    const plugin = closureNextRollup({}) as Plugin;
    expect(plugin).toBeDefined();
  });

  test('should handle module resolution', async () => {
    const plugin = closureNextRollup({
      paths: {
        '@test': fixturesPath
      }
    }) as Plugin;

    if (plugin.resolveId) {
      const resolveIdHook = typeof plugin.resolveId === 'function' 
        ? plugin.resolveId 
        : plugin.resolveId.handler;
      const resolved = await resolveIdHook.call(mockPluginContext, '@test/TestComponent.ts', undefined, { 
        attributes: {},
        isEntry: true 
      });
      expect(resolved).toBeTruthy();
      if (typeof resolved === 'object' && resolved !== null) {
        expect(resolved.id).toBe(path.join(fixturesPath, 'TestComponent.ts'));
      }
    }
  });

  test('should handle code splitting', async () => {
    const plugin = closureNextRollup({}) as Plugin;
    const bundle = await rollup({
      input: path.resolve(fixturesPath, 'app.ts'),
      plugins: [plugin],
      external: ['@closure-next/core']
    });

    const { output } = await bundle.generate({
      format: 'esm',
      exports: 'named',
      dir: outputPath,
      entryFileNames: '[name].js',
      chunkFileNames: '[name]-[hash].js',
      sourcemap: true
    });

    expect(output.length).toBeGreaterThan(0);
    const chunks = output.filter(chunk => chunk.type === 'chunk');
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].code).toBeDefined();
  });

  test('should transform TypeScript files', async () => {
    const plugin = closureNextRollup({ codeSplitting: true }) as Plugin;
    
    if (plugin.transform) {
      const transformFn = typeof plugin.transform === 'function' 
        ? plugin.transform 
        : plugin.transform.handler;

      const result = await transformFn.call(mockPluginContext, `
        import { Component } from '@closure-next/core';
        export class TestComponent extends Component {
          renderToString(): string {
            return '<div>Test Component</div>';
          }
        }
      `, 'test.ts');

      expect(result).toBeTruthy();
      if (result) {
        const code = typeof result === 'string' ? result : result.code;
        expect(code).toContain('renderToString');
      }
    }
  });
});
