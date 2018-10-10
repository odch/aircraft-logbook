context('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  afterEach(() => {
    cy.logout()
  })

  it('logs in successfully', () => {
    cy.get('[data-cy=email] input').type('cypress@opendigital.ch')
    cy.get('[data-cy=password] input ').type('cypress')
    cy.get('[data-cy=submit]').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('[data-cy=user-button]')
  })
})
