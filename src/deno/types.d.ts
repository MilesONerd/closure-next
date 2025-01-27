/**
 * @fileoverview Type definitions for Deno integration.
 * @license Apache-2.0
 */

declare namespace Deno {
  export interface DenoNamespace {
    version: {
      deno: string;
    };
  }
}

declare const Deno: Deno.DenoNamespace;
