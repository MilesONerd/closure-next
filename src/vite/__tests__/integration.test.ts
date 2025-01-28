import { closureNextVite } from '../index';
import { createServer } from 'vite';
import path from 'path';
import fs from 'fs';

describe('Vite Integration', () => {
  const fixturesPath = path.resolve(__dirname, 'fixtures');
  
  beforeAll(() => {
    if (!fs.existsSync(fixturesPath)) {
      fs.mkdirSync(fixturesPath, { recursive: true });
    }
  });

  test('should configure module resolution', async () => {
    const plugin = closureNextVite({
      paths: {
        '@test': path.resolve(__dirname, 'fixtures')
      }
    });

    const config = plugin.config?.({}) || {};
    expect(config.resolve?.alias).toBeDefined();
    expect(config.resolve?.alias['@test']).toBe(path.resolve(__dirname, 'fixtures'));
  });

  test('should handle HMR', async () => {
    const plugin = closureNextVite({ hmr: true });
    const server = await createServer({
      root: fixturesPath,
      plugins: [plugin]
    });

    // Mock WebSocket
    const ws = {
      send: jest.fn()
    };
    server.ws = ws;

    // Trigger file change
    const filePath = path.join(fixturesPath, 'test.ts');
    server.watcher.emit('change', filePath);

    expect(ws.send).toHaveBeenCalledWith(expect.objectContaining({
      type: 'custom',
      event: 'closure-next-hmr'
    }));

    await server.close();
  });

  test('should transform TypeScript files', () => {
    const plugin = closureNextVite({ hmr: true });
    const result = plugin.transform?.(`
      import { Component } from '@closure-next/core';
      export class TestComponent extends Component {}
    `, 'test.ts');

    expect(result).toBeDefined();
    expect(result?.code).toContain('import.meta.hot');
  });
});
