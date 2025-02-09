/**
 * @fileoverview Lazy loading implementation for Closure Next.
 * @license Apache-2.0
 */
export declare class Lazy<T> {
    private value;
    private factory;
    constructor(factory: () => Promise<T>);
    get(): Promise<T>;
    isLoaded(): boolean;
    reset(): void;
}
//# sourceMappingURL=lazy.d.ts.map