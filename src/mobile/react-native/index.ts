import { createMobileComponent } from '../index';
import type { Component } from '@closure-next/core';

export const createReactNativeComponent = <T extends Component>(
  ComponentClass: new () => T,
  options = {}
) => {
  return createMobileComponent(ComponentClass, {
    ...options,
    platform: 'react-native',
  });
};
