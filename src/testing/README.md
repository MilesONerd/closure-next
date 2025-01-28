# Closure Next Testing Utilities

Testing utilities for Closure Next components, providing Jest matchers and Cypress commands.

## Installation

```bash
npm install @closure-next/testing
```

## Jest Usage

```typescript
import { createMockComponent, mountComponent, simulateEvent } from '@closure-next/testing/jest';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { component } = mountComponent(MyComponent, {
      title: 'Test'
    });
    expect(component).toBeRendered();
  });

  it('should handle events', () => {
    const { component } = mountComponent(MyComponent);
    simulateEvent(component, 'click');
    expect(component).toHaveState(ComponentState.ACTIVE);
  });
});
```

## Cypress Usage

```typescript
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  it('should render and interact', () => {
    cy.mountClosureComponent(MyComponent, {
      title: 'Test'
    })
      .getClosureElement()
      .should('be.visible')
      .triggerClosureEvent('click')
      .shouldHaveState(ComponentState.ACTIVE);
  });
});
```

## Features

- 🧪 Custom Jest matchers
- 🔍 Cypress commands
- 🎭 Component mocking
- ⚡️ Event simulation
- 🔄 Async utilities

## API Reference

### Jest Utilities

#### `createMockComponent<T extends Component>(ComponentClass, props?)`

Creates a mock component for testing.

#### `mountComponent<T extends Component>(ComponentClass, props?)`

Mounts a component in a test container.

#### `simulateEvent(component, eventType, eventInit?)`

Simulates events on components.

#### `waitForUpdate()`

Waits for component updates.

### Custom Jest Matchers

- `toBeRendered()`
- `toHaveState(state)`
- `toHaveChildren(count)`

### Cypress Commands

- `mountClosureComponent(ComponentClass, props?)`
- `getClosureElement()`
- `triggerClosureEvent(eventType, eventInit?)`
- `shouldHaveState(state)`

## Examples

### Jest Testing

```typescript
import { ComponentState } from '@closure-next/core';
import { mountComponent } from '@closure-next/testing/jest';

test('component lifecycle', async () => {
  // Mount component
  const { component } = mountComponent(MyComponent);
  expect(component).toBeRendered();

  // Simulate interaction
  simulateEvent(component, 'click');
  expect(component).toHaveState(ComponentState.ACTIVE);

  // Wait for updates
  await waitForUpdate();
  expect(component).toHaveChildren(2);
});
```

### Cypress Testing

```typescript
import { ComponentState } from '@closure-next/core';

describe('Component Integration', () => {
  it('should integrate with other components', () => {
    cy.mountClosureComponent(ParentComponent)
      .getClosureElement()
      .find('[data-child]')
      .should('have.length', 2)
      .first()
      .triggerClosureEvent('click')
      .shouldHaveState(ComponentState.SELECTED);
  });
});
```

## Development

```bash
# Build the package
npm run build

# Run tests
npm test
```

## License

Apache-2.0
