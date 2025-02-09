import { createMobileComponent } from '../index';
import type { Component } from '@closure-next/core';

export const createFlutterComponent = <T extends Component>(
  ComponentClass: new () => T,
  options = {}
) => {
  return createMobileComponent(ComponentClass, {
    ...options,
    platform: 'flutter-web',
  });
};
