Cypress.Commands.add('login', (email, password) =>
  cy
    .window()
    .then(win =>
      win.firebase.auth().signInWithEmailAndPassword(email, password)
    )
)

Cypress.Commands.add('logout', () =>
  cy.window().then(win => win.firebase.auth().signOut())
)

Cypress.Commands.add('deleteTestUser', () =>
  cy.window().then({ timeout: 10000 }, win => {
    const deleteTestUser = win.firebase
      .functions()
      .httpsCallable('deleteTestUser')
    return deleteTestUser()
  })
)
