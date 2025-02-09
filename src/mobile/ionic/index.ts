import { createMobileComponent } from '../index';
import type { Component } from '@closure-next/core';

export const createIonicComponent = <T extends Component>(
  ComponentClass: new () => T,
  options = {}
) => {
  return createMobileComponent(ComponentClass, {
    ...options,
    platform: 'ionic',
  });
};
