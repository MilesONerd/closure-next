# Closure Next Angular Integration

Plug-and-play integration between Closure Next components and Angular applications.

## Installation

```bash
npm install @closure-next/angular
```

## Usage

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { ClosureNextModule } from '@closure-next/angular';

@NgModule({
  imports: [ClosureNextModule],
  // ...
})
export class AppModule {}

// app.component.ts
import { Component } from '@angular/core';
import { MyClosureComponent } from './my-component';

@Component({
  selector: 'app-root',
  template: `
    <div
      closureComponent
      [component]="component"
      [props]="props">
    </div>
  `
})
export class AppComponent {
  component = MyClosureComponent;
  props = {
    title: 'Hello from Closure Next',
    onClick: () => alert('Clicked!')
  };
}
```

## Features

- 🔌 Plug-and-play integration
- ⚡️ Full TypeScript support
- 🔄 Reactive props
- 🧹 Automatic cleanup
- 🎯 Direct DOM integration
- 💉 Angular dependency injection support

## API Reference

### `ClosureComponentDirective`

An Angular directive that creates and manages a Closure Next component.

#### Inputs

- `component`: Constructor - The Closure Next component class
- `props`: Object - Props to pass to the component

### `ClosureNextModule`

The Angular module that provides the Closure Next integration.

## TypeScript Support

```typescript
import type { Component as ClosureComponent } from '@closure-next/core';
import { Component } from '@angular/core';

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

class MyComponent extends ClosureComponent {
  // Implementation
}

@Component({
  selector: 'app-root',
  template: `
    <div
      closureComponent
      [component]="component"
      [props]="props">
    </div>
  `
})
export class AppComponent {
  component = MyComponent;
  props: MyComponentProps = {
    title: 'Hello', // Type-checked
    onClick: () => {} // Type-checked
  };
}
```

## Angular Features

### Dependency Injection

The integration works seamlessly with Angular's dependency injection system:

```typescript
import { Injectable } from '@angular/core';
import { ClosureComponent } from '@closure-next/core';

@Injectable({ providedIn: 'root' })
export class ClosureService {
  createComponent(element: HTMLElement): ClosureComponent {
    const component = new MyClosureComponent();
    component.render(element);
    return component;
  }
}
```

### Change Detection

The integration respects Angular's change detection:

```typescript
@Component({
  selector: 'app-root',
  template: `
    <div
      closureComponent
      [component]="component"
      [props]="getProps()">
    </div>
  `
})
export class AppComponent {
  @Input() title = '';
  
  getProps() {
    return {
      title: this.title,
      onClick: () => {}
    };
  }
}
```
