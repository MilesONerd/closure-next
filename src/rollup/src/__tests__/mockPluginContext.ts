import type { 
  PluginContext, 
  ModuleInfo, 
  TransformPluginContext, 
  EmittedFile, 
  SourceMap, 
  RollupError, 
  ResolveIdResult, 
  ModuleOptions, 
  ParseAst,
  PartialNull,
  ProgramNode,
  CustomPluginOptions,
  LoggingFunctionWithPosition,
  ResolvedId
} from 'rollup';
import type { Program } from 'estree';

const createAstNode = () => ({
  type: 'Program',
  body: [],
  sourceType: 'module',
  start: 0,
  end: 0
} as Program);

const moduleInfo: ModuleInfo = {
  id: '',
  code: '',
  ast: createAstNode() as unknown as ProgramNode,
  isEntry: false,
  isExternal: false,
  importedIds: [],
  meta: {},
  moduleSideEffects: true,
  syntheticNamedExports: false,
  dynamicallyImportedIds: [],
  dynamicImporters: [],
  exports: [],
  hasDefaultExport: false,
  importers: [],
  isIncluded: null,
  attributes: {},
  importedIdResolutions: [],
  dynamicallyImportedIdResolutions: [],
  exportedBindings: {},
  implicitlyLoadedAfterOneOf: [],
  implicitlyLoadedBefore: []
};

class ModuleIdIterator implements IterableIterator<string> {
  private ids: string[] = [];
  private index = 0;

  constructor(ids?: string[]) {
    if (ids) {
      this.ids = [...ids];
    }
  }

  next(): IteratorResult<string> {
    if (this.index < this.ids.length) {
      return { value: this.ids[this.index++], done: false };
    }
    return { value: undefined, done: true };
  }

  [Symbol.iterator](): IterableIterator<string> {
    this.index = 0;
    return this;
  }

  add(id: string): void {
    this.ids.push(id);
  }
}

export const mockPluginContext: TransformPluginContext = {
  meta: { rollupVersion: '3.0.0', watchMode: false },
  parse: ((code: string): ProgramNode => createAstNode() as unknown as ProgramNode) as ParseAst,
  warn: ((warning: string | RollupError | (() => string | RollupError), pos?: number | { column: number; line: number }): void => {
    const msg = typeof warning === 'function' ? warning() : warning;
    if (typeof msg === 'string') {
      console.warn(msg);
    } else {
      console.warn(msg.message);
    }
  }) as LoggingFunctionWithPosition,
  error: ((error: string | RollupError): never => { 
    const err = typeof error === 'string' ? new Error(error) : error;
    err.stack = err.stack?.split('\n').slice(0, 2).join('\n');
    throw err;
  }),
  debug: ((msg: string | (() => string)): void => {
    const message = typeof msg === 'function' ? msg() : msg;
    console.debug(message);
  }) as LoggingFunctionWithPosition,
  info: ((msg: string | (() => string)): void => {
    const message = typeof msg === 'function' ? msg() : msg;
    console.info(message);
  }) as LoggingFunctionWithPosition,
  getModuleInfo: (id: string): ModuleInfo | null => {
    const info = { ...moduleInfo, id };
    return info;
  },
  addWatchFile: (id: string): void => {},
  emitFile: (emittedFile: EmittedFile): string => {
    if ('type' in emittedFile) {
      if (emittedFile.type === 'asset') {
        return emittedFile.fileName || emittedFile.name || '';
      } else if (emittedFile.type === 'chunk') {
        return emittedFile.fileName || '';
      }
    }
    throw new Error('Invalid emitted file type');
  },
  setAssetSource: (assetReferenceId: string, source: string | Uint8Array): void => {
    if (typeof source === 'string') {
      const encoder = new TextEncoder();
      source = encoder.encode(source);
    }
  },
  cache: new Map(),

  resolve: async (source: string, importer?: string): Promise<ResolvedId | null> => {
    return {
      id: source,
      external: false,
      moduleSideEffects: true,
      resolvedBy: 'rollup',
      meta: {},
      syntheticNamedExports: false,
      attributes: {}
    };
  },
  load: async ({ id }: { id: string; resolveDependencies?: boolean } & Partial<PartialNull<ModuleOptions>>): Promise<ModuleInfo> => {
    return {
      ...moduleInfo,
      id,
      code: '',
      ast: null as unknown as ProgramNode,
      moduleSideEffects: true,
      syntheticNamedExports: false,
      meta: {},
      attributes: {},
      exports: [],
      importers: [],
      dynamicImporters: [],
      hasDefaultExport: false,
      importedIds: [],
      dynamicallyImportedIds: []
    };
  },
  getCombinedSourcemap: () => ({
    version: 3,
    file: '',
    sources: [],
    sourcesContent: [],
    names: [],
    mappings: '',
    toString: () => '',
    toUrl: () => ''
  } as SourceMap),
  getFileName: (fileReferenceId: string): string => fileReferenceId,
  getModuleIds: () => new ModuleIdIterator(),
  getWatchFiles: () => []
};
