# Closure Next Mobile Integration

Mobile and hybrid platform integration for Closure Next components.

## Installation

```bash
npm install @closure-next/mobile
```

## Usage

### Mobile Component

```typescript
import { createMobileComponent } from '@closure-next/mobile';
import { MyComponent } from './my-component';

const MobileMyComponent = createMobileComponent(MyComponent, {
  touch: true,
  gestures: true,
  platformStyles: true
});

// Use the mobile-optimized component
const component = new MobileMyComponent();
component.render(element);
```

### Hybrid Component

```typescript
import { createHybridComponent } from '@closure-next/mobile';
import { MyComponent } from './my-component';

const HybridMyComponent = createHybridComponent(MyComponent, {
  touch: true,
  gestures: true,
  platformStyles: true
});

// Use the hybrid component
const component = new HybridMyComponent();
component.render(element);

// Listen for native messages
element.addEventListener('native-message', (e: CustomEvent) => {
  console.log('Message from native:', e.detail);
});
```

## Features

- 📱 Mobile-optimized components
- 🤝 Hybrid app integration
- 👆 Touch event handling
- 🎯 Gesture recognition
- 🎨 Platform-specific styles
- 🔌 Native bridge support

## API Reference

### `createMobileComponent<T extends Component>(ComponentClass, options?)`

Creates a mobile-optimized version of a Closure component.

#### Options

- `touch`: Enable touch events (default: true)
- `gestures`: Enable gesture recognition (default: true)
- `platformStyles`: Enable platform-specific styles (default: true)

### `createHybridComponent<T extends Component>(ComponentClass, options?)`

Creates a hybrid app version of a Closure component with native bridge support.

## Mobile Features

### Touch Events

```typescript
const MobileButton = createMobileComponent(Button);
const button = new MobileButton();

element.addEventListener('touchstart', (e: TouchEvent) => {
  // Handle touch start
});

element.addEventListener('gesture', (e: CustomEvent) => {
  const { deltaX, deltaY } = e.detail;
  // Handle gesture
});
```

### Platform Detection

```typescript
const MobileComponent = createMobileComponent(MyComponent);
const component = new MobileComponent();

// Platform-specific classes are automatically added:
// - closure-next-ios
// - closure-next-android
// - closure-next-mobile
```

## Hybrid Features

### Native Communication

```typescript
const HybridComponent = createHybridComponent(MyComponent);
const component = new HybridComponent();

// Send message to native app
component.sendToNative({
  type: 'action',
  data: { /* ... */ }
});

// Receive messages from native app
element.addEventListener('native-message', (e: CustomEvent) => {
  const message = e.detail;
  // Handle native message
});
```

### Platform Bridge

#### iOS

```swift
// iOS WKWebView configuration
let config = WKWebViewConfiguration()
let controller = WKUserContentController()
config.userContentController = controller

// Register message handler
class ClosureNextHandler: NSObject, WKScriptMessageHandler {
    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        // Handle messages from web
    }
}

controller.add(ClosureNextHandler(), name: "closureNext")
```

#### Android

```kotlin
// Android WebView configuration
webView.addJavascriptInterface(object {
    @JavascriptInterface
    fun postMessage(message: String) {
        // Handle messages from web
    }
}, "closureNext")
```

## TypeScript Support

```typescript
import type { Component } from '@closure-next/core';
import { createMobileComponent } from '@closure-next/mobile';

interface MyComponentProps {
  onGesture: (deltaX: number, deltaY: number) => void;
}

class MyComponent extends Component {
  // Implementation
}

const MobileComponent = createMobileComponent<MyComponent>(MyComponent);
```
