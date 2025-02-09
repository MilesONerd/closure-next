import { MobileComponent } from '../components/mobile';
import type { Component, DOMHelper } from '@closure-next/core';
import type { IonicOptions } from '../types';

export const createIonicComponent = <T extends Component>(
  ComponentClass: new (domHelper: DOMHelper) => T,
  options: IonicOptions = {},
  domHelper?: DOMHelper
): MobileComponent<T> => {
  const mobileOptions: IonicOptions = {
    ...options,
    platform: 'ionic',
    touch: options.touch ?? true,
    gestures: options.gestures ?? true,
    platformStyles: options.platformStyles ?? true
  };
  return new MobileComponent(ComponentClass, mobileOptions, domHelper);
};
