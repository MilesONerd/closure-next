import type { WebSocket, Server as WebSocketServer } from 'ws';
import type { AddressInfo } from 'net';
import { jest, describe, test, expect } from '@jest/globals';
import type { EventEmitter } from 'events';

interface MockWebSocketServer extends WebSocketServer {
  clients: Set<WebSocket>;
  send?: jest.Mock;
}

describe('MockWebSocketServer', () => {
  test('should create a mock server with expected methods', () => {
    const server = createMockWebSocketServer();
    expect(server.address).toBeDefined();
    expect(server.close).toBeDefined();
    expect(server.on).toBeDefined();
    expect(server.emit).toBeDefined();
    expect(server.clients).toBeInstanceOf(Set);
  });

  test('should handle client connections', () => {
    const server = createMockWebSocketServer();
    const mockClient = {} as WebSocket;
    server.clients.add(mockClient);
    expect(server.clients.size).toBe(1);
  });
});

export function createMockWebSocketServer(): MockWebSocketServer {
  const mockServer = {
    clients: new Set<WebSocket>(),
    address: jest.fn().mockReturnValue({ port: 8080, address: '127.0.0.1', family: 'IPv4' } as AddressInfo),
    close: jest.fn().mockImplementation(function(this: MockWebSocketServer) { return this; }),
    handleUpgrade: jest.fn(),
    shouldHandle: jest.fn().mockReturnValue(true),
    on: jest.fn().mockReturnThis(),
    once: jest.fn().mockReturnThis(),
    off: jest.fn().mockReturnThis(),
    addListener: jest.fn().mockReturnThis(),
    removeListener: jest.fn().mockReturnThis(),
    removeAllListeners: jest.fn().mockReturnThis(),
    setMaxListeners: jest.fn().mockReturnThis(),
    getMaxListeners: jest.fn().mockReturnValue(10),
    emit: jest.fn().mockReturnValue(true),
    listeners: jest.fn().mockReturnValue([]),
    rawListeners: jest.fn().mockReturnValue([]),
    listenerCount: jest.fn().mockReturnValue(0),
    prependListener: jest.fn().mockReturnThis(),
    prependOnceListener: jest.fn().mockReturnThis(),
    eventNames: jest.fn().mockReturnValue([]),
    send: jest.fn(),
    _events: {},
    _eventsCount: 0,
    _maxListeners: undefined
  };

  return mockServer as unknown as MockWebSocketServer;
}
