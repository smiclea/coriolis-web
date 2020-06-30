import { StubTypes } from '.'

Cypress.Commands.add('loginStub', () => {
  cy.server()
  cy.route({
    method: 'GET',
    url: '**/auth/**',
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
})

Cypress.Commands.add('stubItems', (items: StubTypes[]) => {
  cy.server()

  items.forEach(item => {
    switch (item) {
      case 'replicas':
        cy.route({
          method: 'GET',
          url: '**/replicas',
          response: 'fixture:transfer/replicas.json',
        })
        break
      case 'migrations':
        cy.route({
          method: 'GET',
          url: '**/migrations',
          response: 'fixture:transfer/migrations.json',
        })
        break
      case 'endpoints':
        cy.route({
          method: 'GET',
          url: '**/endpoints',
          response: 'fixture:endpoints/endpoints.json',
        })
        break
      default:
    }
  })
})
