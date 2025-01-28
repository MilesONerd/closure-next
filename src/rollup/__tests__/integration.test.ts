import { closureNextRollup } from '../index';
import { rollup } from 'rollup';
import path from 'path';
import fs from 'fs';

describe('Rollup Integration', () => {
  const outputPath = path.resolve(__dirname, 'dist');
  const fixturesPath = path.resolve(__dirname, 'fixtures');
  
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

  test('should handle module resolution', async () => {
    const plugin = closureNextRollup({
      paths: {
        '@test': fixturesPath
      }
    });

    const resolved = await plugin.resolveId?.('@test/component', null);
    expect(resolved).toBe(path.join(fixturesPath, 'component'));
  });

  test('should handle code splitting', async () => {
    const plugin = closureNextRollup({ codeSplitting: true });
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
    const plugin = closureNextRollup({ codeSplitting: true });
    const result = plugin.transform?.(`
      import { Component } from '@closure-next/core';
      export class TestComponent extends Component {}
    `, 'test.ts');

    expect(result).toBeDefined();
    expect(result?.code).toContain('import.meta.ROLLUP_FILE_URL');
  });
});
