context('Account Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.login('cypress@opendigital.ch', 'cypress')
  })

  afterEach(() => {
    cy.logout()
  })

  it('navigates to organizations page', () => {
    cy.get('[data-cy=user-button]').click()
    cy.get('[data-cy=menu-item-organizations]').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/organizations')
  })

  it('navigates to organization detail page', () => {
    // TODO: enable once Cypress works with Firestore
    // cy.visit('/organizations/odch')
    //
    // cy.get('[data-cy=user-button]').click()
    // cy.get('[data-cy=menu-item-selected-organization]').click()
    //
    // cy.url().should('eq', Cypress.config().baseUrl + '/organizations/odch')
  })

  it('logs out successfully', () => {
    cy.get('[data-cy=user-button]').click()
    cy.get('[data-cy=menu-item-logout]').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/login')
  })
})
