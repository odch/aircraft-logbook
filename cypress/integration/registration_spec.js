context('Login', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  afterEach(() => {
    cy.deleteTestUser()
  })

  it('registers in successfully', () => {
    cy.get('[data-cy=email] input').type('test@opendigital.ch')
    cy.get('[data-cy=password] input ').type('mypassword')
    cy.get('[data-cy=submit]').click()
    cy.get('[data-cy=username]').contains('test@opendigital.ch')
  })
})
