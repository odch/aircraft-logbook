context('Aircraft Detail', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.login('cypress@opendigital.ch', 'cypress')
  })

  afterEach(() => {
    cy.logout()
  })

  it('lists latest flights', () => {
    cy.visit('/organizations/odch/aircrafts/58fErEzm3ObCBorZHDmj')
    cy.get('[data-cy=flights-container]')
      .find('[data-cy=flight-panel]')
      .should('have.length', 1)
    cy.get('[data-cy=flight-panel]').contains('From LSZT to LSZT')
  })

  it('create and delete a flight', () => {
    cy.visit('/organizations/odch/aircrafts/58fErEzm3ObCBorZHDmj')

    // step 1: create preflight

    cy.get('[data-cy=flight-create-button]').click()

    cy.get('[data-cy=flight-create-dialog] [data-cy=nature-field]').click()
    cy.get('[data-cy=flight-create-dialog] [data-cy=option-vp]').click()

    cy.get(
      '[data-cy=flight-create-dialog] [data-cy=personsOnBoard-field] input'
    ).type(1)
    cy.get(
      '[data-cy=flight-create-dialog] [data-cy=fuelUplift-field] input'
    ).type(0)
    cy.get(
      '[data-cy=flight-create-dialog] [data-cy=preflightCheck-field]'
    ).click()

    cy.get('[data-cy=flight-create-dialog] [data-cy=create-button]').click()

    cy.get('[data-cy=flight-create-dialog]', { timeout: 30000 }).should(
      'not.exist'
    )

    cy.get('[data-cy=preflight-panel]').should('exist')

    // step 2: complete preflight

    cy.get('[data-cy=flight-create-button]').click()

    cy.get(
      '[data-cy=flight-create-dialog] [data-cy=destinationAerodrome-field] input'
    ).type('LSZT')
    cy.get(
      '[data-cy=flight-create-dialog] [data-cy=option-z9ZbYnXq0NwiNI87PF9w]'
    ).click()

    cy.get(
      '[data-cy=flight-create-dialog] [data-cy=blockOffTime-field] input'
    ).type('0800')
    cy.get(
      '[data-cy=flight-create-dialog] [data-cy=takeOffTime-field] input'
    ).type('0805')
    cy.get(
      '[data-cy=flight-create-dialog] [data-cy=landingTime-field] input'
    ).type('0855')
    cy.get(
      '[data-cy=flight-create-dialog] [data-cy=blockOnTime-field] input'
    ).type('0900')

    cy.get(
      '[data-cy=flight-create-dialog] [data-cy=landings-field] input'
    ).type(1)

    cy.get('[data-cy=flight-create-dialog] [data-cy=nil-radio]').click()

    cy.get('[data-cy=flight-create-dialog] [data-cy=create-button]').click()

    cy.get('[data-cy=flight-create-dialog]').should('not.exist')

    // step 3: delete flight

    cy.get('[data-cy=flights-container]')
      .find('[data-cy=flight-panel]')
      .should('have.length', 2)

    cy.get('[data-cy=flights-container]')
      .find('[data-cy=flight-panel]')
      .first()
      .click()

    cy.get('[data-cy=flight-delete-button]').click()

    cy.get(
      '[data-cy=flight-delete-dialog] [data-cy=flight-delete-button]'
    ).click()

    cy.get('[data-cy=flight-delete-dialog]').should('not.exist')

    cy.get('[data-cy=flights-container]')
      .find('[data-cy=flight-panel]')
      .should('have.length', 1)
  })
})
