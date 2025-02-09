/**
 * @fileoverview Bundle implementation for Closure Next.
 * @license Apache-2.0
 */
import { BundleInterface } from './types';
export declare class Bundle implements BundleInterface {
    private modules;
    private loaded;
    constructor();
    load(): Promise<void>;
    unload(): Promise<void>;
    isLoaded(): boolean;
    getModule<T>(name: string): Promise<T>;
    hasModule(name: string): boolean;
}
//# sourceMappingURL=bundle.d.ts.map