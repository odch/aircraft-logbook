context('Registration', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('registers successfully', () => {
    cy.get('[data-cy=firstname] input').type('Max')
    cy.get('[data-cy=lastname] input').type('Muster')
    cy.get('[data-cy=email] input').type('test@opendigital.ch')
    cy.get('[data-cy=password] input ').type('mypassword')
    cy.get('[data-cy=submit]').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('[data-cy=user-button]')

    cy.deleteTestUser()
  })
})
