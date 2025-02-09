import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { EventTarget, EventType } from '../../src/events';
import type { EventInterface } from '../../src/types';

describe('EventTarget', () => {
  let emitter: EventTarget;

  beforeEach(() => {
    emitter = new EventTarget();
  });

  test('handles event listeners', () => {
    const listener = jest.fn();
    emitter.addEventListener(EventType.TEST, listener);
    emitter.emit(EventType.TEST, 'data');
    expect(listener).toHaveBeenCalledWith({
      type: EventType.TEST,
      target: emitter,
      data: 'data'
    } as EventInterface);
  });

  test('removes event listeners', () => {
    const listener = jest.fn();
    emitter.addEventListener(EventType.TEST, listener);
    emitter.removeEventListener(EventType.TEST, listener);
    emitter.emit(EventType.TEST, 'data');
    expect(listener).not.toHaveBeenCalled();
  });

  test('handles multiple listeners', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    emitter.addEventListener(EventType.TEST, listener1);
    emitter.addEventListener(EventType.TEST, listener2);
    emitter.emit(EventType.TEST, 'data');
    const expectedEvent = {
      type: EventType.TEST,
      target: emitter,
      data: 'data'
    } as EventInterface;
    expect(listener1).toHaveBeenCalledWith(expectedEvent);
    expect(listener2).toHaveBeenCalledWith(expectedEvent);
  });

  test('handles errors in listeners gracefully', () => {
    const listener = jest.fn().mockImplementation(() => {
      throw new Error('Test error');
    });
    emitter.addEventListener(EventType.TEST, listener);
    expect(() => emitter.emit(EventType.TEST, 'data')).not.toThrow();
  });

  test('handles ALL event type', () => {
    const allListener = jest.fn();
    const specificListener = jest.fn();
    emitter.addEventListener(EventType.ALL, allListener);
    emitter.addEventListener(EventType.TEST, specificListener);
    emitter.emit(EventType.TEST, 'data');
    const expectedEvent = {
      type: EventType.TEST,
      target: emitter,
      data: 'data'
    } as EventInterface;
    expect(allListener).toHaveBeenCalledWith(expectedEvent);
    expect(specificListener).toHaveBeenCalledWith(expectedEvent);
  });

  test('cleans up on dispose', () => {
    const listener = jest.fn();
    emitter.addEventListener(EventType.TEST, listener);
    emitter.dispose();
    emitter.emit(EventType.TEST, 'data');
    expect(listener).not.toHaveBeenCalled();
    expect(emitter.isDisposed()).toBe(true);
  });
});
