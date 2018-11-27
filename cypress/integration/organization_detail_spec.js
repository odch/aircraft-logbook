context('Organization Detail', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.login('cypress@opendigital.ch', 'cypress')
  })

  afterEach(() => {
    cy.logout()
  })

  it('lists all aircrafts', () => {
    cy.visit('/organizations/odch')
    cy.get('[data-cy=aircraft-list]').contains('HBKLA')
    cy.get('[data-cy=aircraft-list]').contains('HBKOF')
  })
})
