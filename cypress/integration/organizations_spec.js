context('Organizations', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.login('cypress@opendigital.ch', 'cypress')
  })

  afterEach(() => {
    cy.logout()
  })

  it('lists all organizations', () => {
    cy.visit('/organizations')
    cy.get('[data-cy=organizations-list]').contains('odch')
    cy.get('[data-cy=organizations-list]').contains('cypress-flying-club')
  })

  it('create and delete an organization', () => {
    cy.visit('/organizations')

    cy.get('[data-cy=organization-create-button]').click()

    cy.get(
      '[data-cy=organization-create-dialog] [data-cy=name-field] input'
    ).type('my-test-org')
    cy.get(
      '[data-cy=organization-create-dialog] [data-cy=create-button]'
    ).click()

    cy.wait(500)

    cy.get('[data-cy=organizations-list]').contains('my-test-org')

    cy.visit('/organizations/my-test-org/settings')

    cy.get('[data-cy=organization-title]').contains('my-test-org')

    cy.get('[data-cy=organization-delete-button]').click()

    cy.get(
      '[data-cy=organization-delete-dialog] [data-cy=organization-id-field] input'
    ).type('my-test-org')
    cy.get(
      '[data-cy=organization-delete-dialog] [data-cy=organization-delete-button]'
    ).click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
