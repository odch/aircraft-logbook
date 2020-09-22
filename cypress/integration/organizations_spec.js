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
    const randomOrgId = Math.random().toString(36).substring(7)
    const orgName = 'my-test-org-' + randomOrgId

    cy.visit('/organizations')

    cy.get('[data-cy=organization-create-button]').click()

    cy.get(
      '[data-cy=organization-create-dialog] [data-cy=name-field] input'
    ).type(orgName)
    cy.get(
      '[data-cy=organization-create-dialog] [data-cy=create-button]'
    ).click()

    cy.get(`[data-cy=organization-${orgName}]`, { timeout: 30000 }).click()

    cy.get('[data-cy=user-button]').click()
    cy.get('[data-cy=menu-item-selected-organization-settings]').click()

    cy.get('[data-cy=organization-title]').contains(orgName)

    cy.get('[data-cy=organization-delete-button]').click()

    cy.get(
      '[data-cy=organization-delete-dialog] [data-cy=organization-id-field] input'
    ).type(orgName)
    cy.get(
      '[data-cy=organization-delete-dialog] [data-cy=organization-delete-button]'
    ).click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
