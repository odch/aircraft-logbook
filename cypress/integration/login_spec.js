context('Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  afterEach(() => {
    cy.logout()
  })

  it('logs in successfully', () => {
    cy.get('[data-cy=email] input').type('cypress@opendigital.ch')
    cy.get('[data-cy=password] input ').type('cypress')
    cy.get('[data-cy=submit]').click()
    cy.get('[data-cy=username]').contains('cypress@opendigital.ch')
  })
})
