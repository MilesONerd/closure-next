import { MobileComponent } from '../components/mobile';
import type { Component, DOMHelper } from '@closure-next/core';
import type { FlutterOptions } from '../types';

export const createFlutterComponent = <T extends Component>(
  ComponentClass: new (domHelper: DOMHelper) => T,
  options: FlutterOptions = {},
  domHelper?: DOMHelper
): MobileComponent<T> => {
  const mobileOptions: FlutterOptions = {
    ...options,
    platform: 'flutter-web',
    touch: options.touch ?? true,
    gestures: options.gestures ?? true,
    platformStyles: options.platformStyles ?? true
  };
  return new MobileComponent(ComponentClass, mobileOptions, domHelper);
};
