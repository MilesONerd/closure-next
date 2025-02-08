/// <reference types="cypress" />

import { Component } from '@closure-next/core';

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      mountClosureComponent<T extends Component>(
        ComponentClass: new () => T,
        props?: Record<string, unknown>
      ): Chainable<T>;
      getClosureElement(): Chainable<HTMLElement>;
      triggerClosureEvent(
        eventType: string,
        eventInit?: EventInit
      ): Chainable<HTMLElement>;
      shouldHaveState(state: number): Chainable<HTMLElement>;
    }
  }
}

// Get the global Cypress object
const cypressGlobal = (window as any).Cypress;

if (cypressGlobal) {
  // Mount a Closure component
  cypressGlobal.Commands.add(
    'mountClosureComponent',
    <T extends Component>(ComponentClass: new () => T, props?: Record<string, unknown>) => {
      return cy.window().then((win) => {
        const component = new ComponentClass();
        if (props) {
          Object.entries(props).forEach(([key, value]) => {
            (component as any)[key] = value;
          });
        }

        const container = win.document.createElement('div');
        win.document.body.appendChild(container);
        component.render(container);

        return cy.wrap(component);
      });
    }
  );

  // Get the component's element
  cypressGlobal.Commands.add(
    'getClosureElement',
    { prevSubject: true },
    (subject: Component) => {
      const element = subject.getElement();
      if (!element) {
        throw new Error('Component not rendered');
      }
      return cy.wrap(element);
    }
  );

  // Trigger an event on the component
  cypressGlobal.Commands.add(
    'triggerClosureEvent',
    { prevSubject: true },
    (subject: Component, eventType: string, eventInit?: EventInit) => {
      const element = subject.getElement();
      if (!element) {
        throw new Error('Component not rendered');
      }

      const event = new Event(eventType, eventInit);
      element.dispatchEvent(event);

      return cy.wrap(element);
    }
  );

  // Assert component state
  cypressGlobal.Commands.add(
    'shouldHaveState',
    { prevSubject: true },
    (subject: Component, state: number) => {
      return cy.wrap(subject).then((component: Component) => {
        const actualState = (component as any).getState();
        cy.wrap(actualState).should('equal', state);
      });
    }
  );
}

export {};
