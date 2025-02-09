import { MobileComponent } from '../components/mobile';
import type { Component } from '@closure-next/core';
import type { IonicOptions } from '../types';

export const createIonicComponent = <T extends Component>(
  ComponentClass: new () => T,
  options: IonicOptions = {}
): MobileComponent<T> => {
  const mobileOptions: IonicOptions = {
    ...options,
    platform: 'ionic',
    touch: options.touch ?? true,
    gestures: options.gestures ?? true,
    platformStyles: options.platformStyles ?? true
  };
  return new MobileComponent(ComponentClass, mobileOptions);
};
