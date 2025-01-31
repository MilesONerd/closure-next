import { EventTarget } from '../src/events';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';

type EventHandler = jest.MockedFunction<(this: unknown, evt: Event) => void>;

describe('EventTarget', () => {
  let target: EventTarget;

  beforeEach(() => {
    target = new EventTarget();
  });

  test('should handle event listeners', () => {
    const handler = jest.fn() as EventHandler;
    target.addEventListener('test', handler);
    
    const event = new CustomEvent('test', { detail: { value: 'test' } });
    target.dispatchEvent(event);
    
    expect(handler).toHaveBeenCalledWith(expect.any(CustomEvent));
    const receivedEvent = handler.mock.calls[0][0] as CustomEvent;
    expect(receivedEvent.detail).toEqual({ value: 'test' });
  });

  test('should remove event listeners', () => {
    const handler = jest.fn() as EventHandler;
    target.addEventListener('test', handler);
    target.removeEventListener('test', handler);
    
    target.dispatchEvent(new CustomEvent('test', { detail: { value: 'test' } }));
    expect(handler).not.toHaveBeenCalled();
  });

  test('should handle multiple listeners', () => {
    const handler1 = jest.fn() as EventHandler;
    const handler2 = jest.fn() as EventHandler;
    
    target.addEventListener('test', handler1);
    target.addEventListener('test', handler2);
    
    const event = new CustomEvent('test', { detail: { value: 'test' } });
    target.dispatchEvent(event);
    
    expect(handler1).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(handler2).toHaveBeenCalledWith(expect.any(CustomEvent));
    const receivedEvent1 = handler1.mock.calls[0][0] as CustomEvent;
    const receivedEvent2 = handler2.mock.calls[0][0] as CustomEvent;
    expect(receivedEvent1.detail).toEqual({ value: 'test' });
    expect(receivedEvent2.detail).toEqual({ value: 'test' });
  });

  test('should clean up on dispose', () => {
    const handler = jest.fn() as EventHandler;
    target.addEventListener('test', handler);
    
    target.dispose();
    target.dispatchEvent(new CustomEvent('test', { detail: { value: 'test' } }));
    
    expect(handler).not.toHaveBeenCalled();
  });
});
