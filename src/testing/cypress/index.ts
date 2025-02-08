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

const cypressGlobal = (window as any).Cypress;

if (cypressGlobal) {
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

        component.enterDocument();
        const element = component.getElement();
        if (element) {
          win.document.body.appendChild(element);
        }

        return cy.wrap(component);
      });
    }
  );

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
