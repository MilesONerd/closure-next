import { MobileComponent } from '../components/mobile';
import type { Component, DOMHelper } from '@closure-next/core';
import type { ReactNativeOptions } from '../types';

export const createReactNativeComponent = <T extends Component>(
  ComponentClass: new (domHelper: DOMHelper) => T,
  options: ReactNativeOptions = {},
  domHelper?: DOMHelper
): MobileComponent<T> => {
  const mobileOptions: ReactNativeOptions = {
    ...options,
    platform: 'react-native',
    touch: options.touch ?? true,
    gestures: options.gestures ?? true,
    platformStyles: options.platformStyles ?? true
  };
  return new MobileComponent(ComponentClass, mobileOptions, domHelper);
};
