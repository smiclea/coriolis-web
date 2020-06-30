/// <reference types="cypress" />

export type StubTypes = 'replicas' | 'migrations' | 'endpoints'

declare namespace Cypress {
  interface Chainable {
    loginStub(): void
    stubItems(items: StubTypes[]): void
  }
}
