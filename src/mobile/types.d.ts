/**
 * @fileoverview Type definitions for mobile/hybrid integration.
 * @license Apache-2.0
 */

interface Window {
  webkit?: {
    messageHandlers?: {
      closureNext?: {
        postMessage(message: any): void;
      };
    };
  };
  closureNext?: {
    postMessage(message: string): void;
  };
}
