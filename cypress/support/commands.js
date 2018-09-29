Cypress.Commands.add('logout', () => {
  cy.window().then(win => {
    win.firebase.auth().signOut()
  })
})
