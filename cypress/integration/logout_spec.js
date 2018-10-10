context('Logout', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.login('cypress@opendigital.ch', 'cypress')
  })

  it('logs out successfully', () => {
    cy.get('[data-cy=user-button]').click()
    cy.get('[data-cy=menu-item-logout]').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/login')
  })
})
