declare global {
  interface WebkitMessageHandler {
    postMessage: (message: unknown) => void;
  }

  interface WebkitMessageHandlers {
    closureNext?: WebkitMessageHandler;
  }

  interface WebkitInterface {
    messageHandlers?: WebkitMessageHandlers;
  }

  interface ClosureNextInterface {
    postMessage: (message: string) => void;
  }

  interface Window {
    webkit?: WebkitInterface;
    closureNext?: ClosureNextInterface;
  }
}

export {};
