import { MobileComponent } from '../components/mobile';
import type { Component } from '@closure-next/core';
import type { FlutterOptions } from '../types';

export const createFlutterComponent = <T extends Component>(
  ComponentClass: new () => T,
  options: FlutterOptions = {}
): MobileComponent<T> => {
  const mobileOptions: FlutterOptions = {
    ...options,
    platform: 'flutter-web',
    touch: options.touch ?? true,
    gestures: options.gestures ?? true,
    platformStyles: options.platformStyles ?? true
  };
  return new MobileComponent(ComponentClass, mobileOptions);
};
