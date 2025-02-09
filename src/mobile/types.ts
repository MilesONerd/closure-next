import type { Component } from '@closure-next/core';

export interface MobileComponentOptions {
  /** Enable touch events */
  touch?: boolean;
  /** Enable gesture recognition */
  gestures?: boolean;
  /** Platform-specific styles */
  platformStyles?: boolean;
  /** Target platform */
  platform?: 'react-native' | 'ionic' | 'flutter-web';
}

export interface ReactNativeOptions extends MobileComponentOptions {
  reactNative?: {
    nativeModules?: boolean;
    optimizations?: boolean;
  };
}

export interface IonicOptions extends MobileComponentOptions {
  ionic?: {
    capacitor?: boolean;
    cordova?: boolean;
  };
}

export interface FlutterOptions extends MobileComponentOptions {
  flutter?: {
    webRendering?: 'canvaskit' | 'html';
    optimization?: boolean;
  };
}

export type { Component };
