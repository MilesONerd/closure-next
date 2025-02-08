import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { closureNextVite } from '../index.js';
import type { Plugin, ViteDevServer, ModuleNode, ModuleGraph, UserConfig, ConfigEnv, AliasOptions, ResolvedConfig } from 'vite';
import type { FSWatcher } from 'chokidar';
import type { TransformPluginContext, SourceMap, EmittedFile, LoggingFunctionWithPosition, ParseAst, ModuleInfo, ResolvedId, RollupError } from 'rollup';
import type { Mock } from 'jest-mock';
import type { EventEmitter } from 'events';
import type { Connect } from 'vite';
import type { WebSocket, Server as WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createMockWebSocketServer } from './mockWebSocketServer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesPath = path.resolve(__dirname, 'fixtures');
const filePath = path.join(fixturesPath, 'TestComponent.ts');

describe('Vite Integration', () => {
  let plugin: Plugin;
  let mockWs: WebSocketServer;
  let mockWatcher: FSWatcher;
  let moduleGraph: ModuleGraph;
  let server: ViteDevServer;

  beforeEach(() => {
    plugin = closureNextVite({
      paths: {
        '@test': path.resolve(__dirname, 'fixtures')
      }
    });

    mockWs = {
      clients: new Set<WebSocket>(),
      address: jest.fn().mockReturnValue({ port: 8080, address: '127.0.0.1', family: 'IPv4' }),
      close: jest.fn().mockImplementation(function(this: any) { return this; }),
      handleUpgrade: jest.fn(),
      shouldHandle: jest.fn().mockReturnValue(true),
      on: jest.fn().mockReturnThis(),
      once: jest.fn().mockReturnThis(),
      off: jest.fn().mockReturnThis(),
      addListener: jest.fn().mockReturnThis(),
      removeListener: jest.fn().mockReturnThis(),
      removeAllListeners: jest.fn().mockReturnThis(),
      setMaxListeners: jest.fn().mockReturnThis(),
      getMaxListeners: jest.fn().mockReturnValue(10),
      emit: jest.fn().mockReturnValue(true),
      listeners: jest.fn().mockReturnValue([]),
      rawListeners: jest.fn().mockReturnValue([]),
      listenerCount: jest.fn().mockReturnValue(0),
      prependListener: jest.fn().mockReturnThis(),
      prependOnceListener: jest.fn().mockReturnThis(),
      eventNames: jest.fn().mockReturnValue([])
    } as unknown as WebSocketServer;

    mockWatcher = {
      emit: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
      off: jest.fn().mockReturnThis(),
      add: jest.fn().mockReturnThis(),
      unwatch: jest.fn().mockReturnThis(),
      close: jest.fn().mockReturnThis(),
      getWatched: jest.fn().mockReturnValue({}),
      removeListener: jest.fn().mockReturnThis(),
      removeAllListeners: jest.fn().mockReturnThis(),
      setMaxListeners: jest.fn().mockReturnThis(),
      addListener: jest.fn().mockReturnThis(),
      eventNames: jest.fn().mockReturnValue([]),
      getMaxListeners: jest.fn().mockReturnValue(10),
      listenerCount: jest.fn().mockReturnValue(0),
      listeners: jest.fn().mockReturnValue([]),
      prependListener: jest.fn().mockReturnThis(),
      prependOnceListener: jest.fn().mockReturnThis(),
      rawListeners: jest.fn().mockReturnValue([]),
      options: {},
      _events: {},
      _eventsCount: 0,
      _maxListeners: undefined
    } as unknown as FSWatcher & EventEmitter;
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

    const userConfig = {} as UserConfig;
    const env = {} as ConfigEnv;
    
    const configResult = await (typeof plugin.config === 'function'
      ? plugin.config(userConfig, env)
      : plugin.config?.handler?.(userConfig, env));
    mockWs = createMockWebSocketServer();

    mockWatcher = {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      add: jest.fn(),
      unwatch: jest.fn(),
      close: jest.fn(),
      removeListener: jest.fn(),
      removeAllListeners: jest.fn(),
      setMaxListeners: jest.fn(),
      addListener: jest.fn(),
      eventNames: jest.fn(),
      getMaxListeners: jest.fn(),
      listenerCount: jest.fn(),
      listeners: jest.fn(),
      prependListener: jest.fn(),
      prependOnceListener: jest.fn(),
      rawListeners: jest.fn(),
      getWatched: jest.fn(),
      _events: {},
      _eventsCount: 0,
      _maxListeners: undefined,
      closed: false,
      options: {},
      _ignoredPaths: new Set(),
      _closers: []
    } as unknown as FSWatcher;

    moduleGraph = {
      getModuleById: jest.fn().mockReturnValue(null),
      getModulesByFile: jest.fn().mockReturnValue([]),
      getModuleByUrl: jest.fn().mockImplementation(function(this: any, ...args: any[]) {
        const url = args[0] as string;
        if (!url) return null;
        return {
          id: url,
          url,
          file: fixturesPath + '/TestComponent.ts',
          type: 'js',
          info: {
            id: url,
            isEntry: false,
            importers: new Set<ModuleNode>(),
            importedIds: new Set<string>(),
            exportedBindings: new Map<string, string[]>(),
            meta: {},
            moduleSideEffects: true,
            syntheticNamedExports: false,
            ast: null,
            code: '',
            dynamicImporters: new Set<string>(),
            dynamicallyImportedIds: new Set<string>(),
            dynamicallyImportedIdResolutions: new Map<string, ResolvedId>(),
            exports: new Set<string>(),
            hasDefaultExport: false,
            importedIdResolutions: new Map<string, ResolvedId>(),
            implicitlyLoadedAfterOneOf: new Set<string>(),
            implicitlyLoadedBefore: new Set<string>(),
            ssrModule: null,
            ssrTransformResult: null,
            transformResult: null,
            timestamp: Date.now(),
            isExternal: false,
            isIncluded: true,
            assertions: {},
            attributes: {},
            customTransformResult: null,
            resolvedIds: new Map<string, ResolvedId>(),
            moduleGraph: null
          },
          ssrModule: null,
          ssrError: null,
          lastHMRTimestamp: 0,
          lastInvalidationTimestamp: 0,
          transformResult: null,
          ssrTransformResult: null,
          clientImportedModules: new Set<ModuleNode>(),
          ssrImportedModules: new Set<ModuleNode>(),
          acceptedHmrExports: new Set<string>(),
          importedBindings: new Map<string, Set<string>>(),
          resolvedModules: new Map<string, ModuleNode>(),
          importedModules: new Set<ModuleNode>(),
          acceptedHmrDeps: new Set<string>(),
          isSelfAccepting: false,
          importers: new Set<ModuleNode>()
        };
      }),
      invalidateModule: jest.fn(),
      updateModuleInfo: jest.fn(),
      ensureEntryFromUrl: jest.fn().mockImplementation(async () => ({} as ModuleNode)),
      resolveUrl: jest.fn().mockImplementation(async () => ['', false])
    } as unknown as ModuleGraph;

    const mockServer = {
      ws: mockWs,
      watcher: mockWatcher,
      moduleGraph,
      config: {
        root: fixturesPath,
        base: '/',
        build: {
          target: 'modules',
          outDir: 'dist',
          assetsDir: 'assets'
        },
        preview: {},
        plugins: [plugin],
        server: {
          hmr: true
        },
        resolve: {
          alias: {},
          dedupe: [],
          conditions: [],
          mainFields: ['module', 'jsnext:main', 'jsnext']
        },
        optimizeDeps: {
          entries: [],
          exclude: [],
          include: []
        },
        ssr: {
          external: [],
          noExternal: [],
          target: 'node'
        },
        logLevel: 'info',
        configFile: undefined,
        configFileDependencies: [],
        inlineConfig: {},
        env: { mode: 'development', command: 'serve' },
        command: 'serve',
        mode: 'development',
        publicDir: 'public',
        cacheDir: 'node_modules/.vite',
        clearScreen: true,
        appType: 'spa'
      },
      pluginContainer: {
        get: jest.fn().mockReturnValue(plugin),
        buildStart: jest.fn().mockImplementation(async () => {}),
        transform: jest.fn().mockImplementation(async () => ({ code: '', map: null })),
        resolveId: jest.fn().mockImplementation(async () => null),
        load: jest.fn().mockImplementation(async () => null),
        close: jest.fn().mockImplementation(async () => {})
      },
      middlewares: {
        use: jest.fn(),
        route: jest.fn(),
        stack: [],
        handle: jest.fn(),
        listen: jest.fn(),
        on: jest.fn(),
        once: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        removeAllListeners: jest.fn(),
        setMaxListeners: jest.fn(),
        getMaxListeners: jest.fn(),
        listeners: jest.fn(),
        rawListeners: jest.fn(),
        listenerCount: jest.fn(),
        prependListener: jest.fn(),
        prependOnceListener: jest.fn(),
        eventNames: jest.fn()
      } as unknown as Connect.Server,
      transformRequest: jest.fn().mockImplementation(async () => ({ code: '', map: null })),
      transformIndexHtml: jest.fn().mockImplementation(async () => ''),
      ssrLoadModule: jest.fn().mockImplementation(async () => ({})),
      ssrFixStacktrace: jest.fn().mockImplementation(() => ''),
      ssrRewriteStacktrace: jest.fn().mockImplementation(() => ''),
      listen: jest.fn().mockImplementation(async () => {}),
      close: jest.fn().mockImplementation(async () => {}),
      restart: jest.fn().mockImplementation(async () => {}),
      printUrls: jest.fn(),
      resolveId: jest.fn().mockImplementation(async () => null),
      createResolver: jest.fn().mockImplementation(() => async () => null),
      hasOptimizedDeps: jest.fn().mockReturnValue(false),
      optimizeDeps: {
        metadata: {
          hash: '',
          browserHash: '',
          optimized: {},
          chunks: {},
          discovered: {},
          optimizedDepImports: {}
        }
      }
    };

    const server = mockServer as unknown as ViteDevServer;

    const filePath = path.join(fixturesPath, 'TestComponent.ts');
    if (plugin.configureServer) {
      const configureServerHook = typeof plugin.configureServer === 'function'
        ? plugin.configureServer
        : plugin.configureServer.handler;
      
      await configureServerHook.call(undefined, server);
      mockWatcher.emit('change', filePath);

      const clients = Array.from(mockWs.clients);
      expect(clients.length).toBe(0); // No clients connected yet, but server is ready
      expect(mockWatcher.on).toHaveBeenCalledWith('change', expect.any(Function));
    }

    await server.close();
    expect(mockWatcher.on).toHaveBeenCalledWith('change', expect.any(Function));
  });

  test('should transform TypeScript files', async () => {
    const plugin = closureNextVite({ hmr: true });
    const code = `
      import { Component } from '@closure-next/core';
      import { TestComponent } from './TestComponent.ts';
      export class AppComponent extends Component {}
    `;

    const transformContext = {
      meta: { rollupVersion: '3.0.0', watchMode: false },
      error: jest.fn().mockImplementation((...args: unknown[]) => { throw args[0]; }),
      warn: jest.fn().mockImplementation((...args: unknown[]) => {}),
      getCombinedSourcemap: jest.fn().mockReturnValue({ 
        mappings: '', 
        names: [], 
        sources: [], 
        version: 3, 
        file: '', 
        toString: () => '',
        toUrl: () => '' 
      }),
      debug: jest.fn().mockImplementation((...args: unknown[]) => {}),
      info: jest.fn().mockImplementation((...args: unknown[]) => {}),
      parse: jest.fn().mockReturnValue({ type: 'Program', body: [] }),
      addWatchFile: jest.fn().mockImplementation((...args: unknown[]) => {}),
      emitFile: jest.fn().mockReturnValue(''),
      getModuleInfo: jest.fn().mockReturnValue(null),
      setAssetSource: jest.fn().mockImplementation((...args: unknown[]) => {}),
      cache: new Map(),
      getFileName: jest.fn().mockReturnValue(''),
      getModuleIds: jest.fn().mockReturnValue([]),
      getWatchFiles: jest.fn().mockReturnValue([]),
      load: jest.fn().mockImplementation(async () => ({ code: '', map: null })),
      resolve: jest.fn().mockImplementation(async () => ({ id: '', external: false }))
    } as unknown as TransformPluginContext;

    try {
      const transformResult = await (typeof plugin.transform === 'function'
        ? plugin.transform.call(transformContext, code, 'app.ts')
        : plugin.transform?.handler?.call(transformContext, code, 'app.ts'));

      expect(transformResult).toBeDefined();
      if (transformResult) {
        const result = typeof transformResult === 'string' ? { code: transformResult } : transformResult;
        expect(result.code).toContain('import.meta.hot');
        expect(result.code).toContain('./TestComponent.js');
        expect(result.code).not.toContain('.ts');
      }
    } catch (error) {
      if (error) {
        console.error('Transform error:', error);
        throw error;
      }
    }
  });
});
