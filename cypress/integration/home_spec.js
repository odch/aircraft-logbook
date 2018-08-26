context('Home', () => {
  it('succesfully renders', () => {
    cy.visit('/')
    cy.contains('Minimal React Webpack Babel Setup')
  })
})
