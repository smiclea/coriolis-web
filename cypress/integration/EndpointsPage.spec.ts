/// <reference types="cypress" />

context('EndpointsPage', () => {
  before(() => {
    cy.loginStub()
    cy.visit(`${Cypress.env('BASE_URL')}/endpoints`)
  })

  it('should show the list of endpoints', () => {
  })
})
