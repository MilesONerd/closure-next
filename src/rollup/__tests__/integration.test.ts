import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { closureNextRollup } from '../src/index.js';
import { rollup, type Plugin } from 'rollup';
import path from 'path';
import { existsSync, rmSync, mkdirSync } from 'fs';

describe('Rollup Integration', () => {
  const outputPath = path.resolve(__dirname, 'dist');
  const fixturesPath = path.resolve(__dirname, 'fixtures');
  
  beforeEach(() => {
    if (existsSync(outputPath)) {
      rmSync(outputPath, { recursive: true });
    }
    if (!existsSync(fixturesPath)) {
      mkdirSync(fixturesPath, { recursive: true });
    }
  });

  afterEach(() => {
    if (existsSync(outputPath)) {
      rmSync(outputPath, { recursive: true });
    }
  });

  test('should handle module resolution', async () => {
    const plugin = closureNextRollup({
      paths: {
        '@test': fixturesPath
      }
    }) as Plugin;

    const resolved = await plugin.resolveId?.handler?.call(null, '@test/component', null, { attributes: {}, isEntry: false });
    expect(resolved).toBe(path.join(fixturesPath, 'component'));
  });

  test('should handle code splitting', async () => {
    const plugin = closureNextRollup({ codeSplitting: true }) as Plugin;
    const bundle = await rollup({
      input: path.resolve(fixturesPath, 'app.ts'),
      plugins: [plugin]
    });

    const { output } = await bundle.generate({
      dir: outputPath,
      format: 'es'
    });

    expect(output).toBeDefined();
    expect(output.find(chunk => chunk.fileName.includes('closure-next'))).toBeDefined();
  });

  test('should transform TypeScript files', () => {
    const plugin = closureNextRollup({ codeSplitting: true }) as Plugin;
    const result = plugin.transform?.handler?.call(null, `
      import { Component } from '@closure-next/core';
      export class TestComponent extends Component {}
    `, 'test.ts');

    expect(result).toBeDefined();
    expect(result?.code).toContain('import.meta.ROLLUP_FILE_URL');
  });
});
