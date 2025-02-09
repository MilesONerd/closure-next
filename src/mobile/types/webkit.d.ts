interface WebKitMessageHandler {
  postMessage(message: any): void;
}

interface WebKitMessageHandlers {
  closureNext: WebKitMessageHandler;
}

interface WebKit {
  messageHandlers: WebKitMessageHandlers;
}

interface Window {
  webkit?: WebKit;
  closureNext?: {
    postMessage(message: string): void;
  };
}
