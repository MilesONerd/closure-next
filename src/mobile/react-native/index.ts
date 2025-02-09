import { MobileComponent } from '../components/mobile';
import type { Component } from '@closure-next/core';
import type { ReactNativeOptions } from '../types';

export const createReactNativeComponent = <T extends Component>(
  ComponentClass: new () => T,
  options: ReactNativeOptions = {}
): MobileComponent<T> => {
  const mobileOptions: ReactNativeOptions = {
    ...options,
    platform: 'react-native',
    touch: options.touch ?? true,
    gestures: options.gestures ?? true,
    platformStyles: options.platformStyles ?? true
  };
  return new MobileComponent(ComponentClass, mobileOptions);
};
