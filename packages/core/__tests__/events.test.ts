import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { EventTarget, EventType } from '../src/events';

describe('EventTarget', () => {
  let emitter: EventTarget;

  beforeEach(() => {
    emitter = new EventTarget();
  });

  test('should handle event listeners', () => {
    const listener = jest.fn();
    emitter.addEventListener(EventType.TEST, listener);
    emitter.emit(EventType.TEST, 'data');
    expect(listener).toHaveBeenCalledWith({
      type: EventType.TEST,
      target: emitter,
      data: 'data'
    });
  });

  test('should remove event listeners', () => {
    const listener = jest.fn();
    emitter.addEventListener(EventType.TEST, listener);
    emitter.removeEventListener(EventType.TEST, listener);
    emitter.emit(EventType.TEST, 'data');
    expect(listener).not.toHaveBeenCalled();
  });

  test('should handle multiple listeners', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    emitter.addEventListener(EventType.TEST, listener1);
    emitter.addEventListener(EventType.TEST, listener2);
    emitter.emit(EventType.TEST, 'data');
    expect(listener1).toHaveBeenCalled();
    expect(listener2).toHaveBeenCalled();
  });

  test('should clean up on dispose', () => {
    const listener = jest.fn();
    emitter.addEventListener(EventType.TEST, listener);
    emitter.dispose();
    emitter.emit(EventType.TEST, 'data');
    expect(listener).not.toHaveBeenCalled();
  });
});
