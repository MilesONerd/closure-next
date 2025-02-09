import type { Component } from '../../../packages/core';

export interface ReactNativeOptions {
  /**
   * Enable touch event handling
   * @default true
   */
  touch?: boolean;

  /**
   * Enable gesture recognition
   * @default true
   */
  gestures?: boolean;

  /**
   * Enable platform-specific styles
   * @default true
   */
  platformStyles?: boolean;

  /**
   * Custom React Native specific options
   */
  reactNative?: {
    /**
     * Enable native module integration
     * @default false
     */
    nativeModules?: boolean;

    /**
     * Enable React Native specific optimizations
     * @default true
     */
    optimizations?: boolean;
  };
}

export type ReactNativeComponent<T extends Component> = T & {
  /**
   * React Native specific properties
   */
  reactNative: {
    /**
     * Send message to native module
     */
    sendToNative: (message: unknown) => void;

    /**
     * Add native event listener
     */
    addNativeListener: (event: string, callback: (data: unknown) => void) => void;
  };
};
