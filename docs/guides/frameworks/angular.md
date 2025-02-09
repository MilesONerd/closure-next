# Angular Integration Guide

## Installation

```bash
npm install @closure-next/angular @closure-next/core
```

## Basic Usage

```typescript
// app.module.ts
import { ClosureModule } from '@closure-next/angular';

@NgModule({
  imports: [ClosureModule],
  // ...
})
export class AppModule { }

// app.component.ts
import { MyComponent } from './MyComponent';

@Component({
  template: `
    <closure-component
      [component]="component"
      [props]="{ title: 'Hello World' }"
    ></closure-component>
  `
})
export class AppComponent {
  component = MyComponent;
}
```

## Server-Side Rendering

### Angular Universal Setup

```typescript
// app.module.ts
import { ClosureSSRModule } from '@closure-next/angular';

@NgModule({
  imports: [
    ClosureModule,
    ClosureSSRModule.forRoot({
      hydration: 'progressive'
    })
  ],
  // ...
})
export class AppModule { }
```

### Hydration Strategies

```typescript
// Progressive hydration
<closure-component
  [component]="component"
  [props]="{ title: 'Hello World' }"
  hydration="progressive"
></closure-component>

// Server-first hydration
<closure-component
  [component]="component"
  [props]="{ title: 'Hello World' }"
  hydration="server-first"
></closure-component>

// Client-only rendering
<closure-component
  [component]="component"
  [props]="{ title: 'Hello World' }"
  hydration="client-only"
></closure-component>
```

## Performance Optimization

### WebAssembly Integration

```typescript
<closure-wasm>
  <ng-template let-ready="ready">
    <closure-component
      *ngIf="ready"
      [component]="component"
      [wasm]="true"
      [props]="{ title: 'Hello World' }"
    ></closure-component>
    <div *ngIf="!ready">Loading WebAssembly...</div>
  </ng-template>
</closure-wasm>
```

### Component Pooling

```typescript
import { Component, Input } from '@angular/core';
import { useComponentPool } from '@closure-next/angular';
import { MyComponent } from './MyComponent';

@Component({
  template: `
    <closure-component
      *ngFor="let item of items"
      [component]="component"
      [pool]="pool"
      [props]="item"
    ></closure-component>
  `
})
export class ListComponent {
  @Input() items: any[];
  component = MyComponent;
  pool = useComponentPool(MyComponent, {
    initialSize: 10,
    maxSize: 100
  });
}
```

## Testing

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClosureModule } from '@closure-next/angular';
import { createTestComponent } from '@closure-next/testing';

describe('MyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosureModule]
    }).compileComponents();
  });

  it('renders correctly', () => {
    const fixture = TestBed.createComponent(ClosureComponent);
    fixture.componentInstance.component = MyComponent;
    fixture.componentInstance.props = { title: 'Test' };
    fixture.detectChanges();
    
    expect(fixture.nativeElement.textContent).toContain('Test');
  });
});
```
