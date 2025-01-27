import { EventTarget } from '../src/events';

describe('EventTarget', () => {
  let target: EventTarget;

  beforeEach(() => {
    target = new EventTarget();
  });

  test('should handle event listeners', () => {
    const handler = jest.fn();
    target.addEventListener('test', handler);
    
    const event = new CustomEvent('test', { detail: { value: 'test' } });
    target.dispatchEvent(event);
    
    expect(handler).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(handler.mock.calls[0][0].detail).toEqual({ value: 'test' });
  });

  test('should remove event listeners', () => {
    const handler = jest.fn();
    target.addEventListener('test', handler);
    target.removeEventListener('test', handler);
    
    target.dispatchEvent(new CustomEvent('test', { detail: { value: 'test' } }));
    expect(handler).not.toHaveBeenCalled();
  });

  test('should handle multiple listeners', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    target.addEventListener('test', handler1);
    target.addEventListener('test', handler2);
    
    const event = new CustomEvent('test', { detail: { value: 'test' } });
    target.dispatchEvent(event);
    
    expect(handler1).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(handler2).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(handler1.mock.calls[0][0].detail).toEqual({ value: 'test' });
    expect(handler2.mock.calls[0][0].detail).toEqual({ value: 'test' });
  });

  test('should clean up on dispose', () => {
    const handler = jest.fn();
    target.addEventListener('test', handler);
    
    target.dispose();
    target.dispatchEvent(new CustomEvent('test', { detail: { value: 'test' } }));
    
    expect(handler).not.toHaveBeenCalled();
  });
});
