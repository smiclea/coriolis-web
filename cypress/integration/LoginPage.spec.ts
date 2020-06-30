/// <reference types="cypress" />

context('LoginPage', () => {
  it('should be on login page', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '**/identity/auth/tokens',
      response: {},
      status: 401,
    })
    cy.visit(`${Cypress.env('BASE_URL')}`)

    cy.get('[class^="Button"]').should('contain.text', 'Login')
  })

  it('should show incorrect username and password', () => {
    cy.get('[name="username"]').type('admin')
    cy.get('[name="password"]').type('password')
    cy.server()
    cy.route({
      method: 'POST',
      url: '*',
      status: 401,
      response: {},
    })
    cy.get('[class^=Button]').contains('Login').click()
    cy.get('[class^="LoginForm__LoginErrorText"]').should('contain.text', 'Incorrect credentials.')
  })

  it('should show server error', () => {
    cy.server()
    cy.route({
      method: 'POST',
      url: '*',
      status: 500,
      response: {},
    })
    cy.get('[class^=Button]').contains('Login').click()
    cy.get('[class^="LoginForm__LoginErrorText"]').should('contain.text', 'Request failed')
  })

  it('should redirect to home page on success', () => {
    cy.server()
    cy.route({
      method: 'POST',
      url: '*',
      response: 'fixture:identity/token.json',
      headers: {
        'X-Subject-Token': 'abcdef',
      },
    })
    cy.route({
      method: 'GET',
      url: '**/users/**',
      response: 'fixture:identity/users.json',
    })
    cy.route({
      method: 'GET',
      url: '**/projects',
      response: 'fixture:identity/projects.json',
    })
    cy.route({
      method: 'GET',
      url: '**/role_assignments**',
      response: 'fixture:identity/role-assignments.json',
    })
    cy.get('[class^=Button]').contains('Login').click()
    cy.location().should(loc => expect(loc.pathname).to.eq('/'))
  })

  it('should redirect to previous page', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '**/auth/**',
      status: 401,
      response: {},
    })
    cy.visit(`${Cypress.env('BASE_URL')}/endpoints`)
    cy.location().should(loc => expect(loc.search).to.eq('?prev=/endpoints'))
    cy.loginStub()
    cy.get('[name="username"]').type('admin')
    cy.get('[name="password"]').type('password')
    cy.get('[class^=Button]').contains('Login').click()
    cy.location().should(loc => expect(loc.pathname).to.eq('/endpoints'))
  })
})
