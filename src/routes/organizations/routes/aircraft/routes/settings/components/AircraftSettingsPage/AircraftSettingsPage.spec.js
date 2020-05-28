import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import renderIntl from '../../../../../../../../testutil/renderIntl'
import AircraftSettingsPage from './AircraftSettingsPage'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('routes', () => {
          describe('settings', () => {
            describe('components', () => {
              describe('AircraftSettingsPage', () => {
                it('renders correctly', () => {
                  const state = {
                    firebase: {
                      auth: {
                        isEmpty: false,
                        email: 'test@opendigital.ch'
                      },
                      profile: {}
                    },
                    main: {
                      app: {
                        organizations: [{ id: 'my_org' }]
                      }
                    },
                    firestore: {
                      data: {
                        organizationAircrafts: {
                          o7flC7jw8jmkOfWo8oyA: {
                            id: 'o7flC7jw8jmkOfWo8oyA',
                            registration: 'HBKFW'
                          },
                          BKi7HYAIoe1i75H3LMk1: {
                            id: 'BKi7HYAIoe1i75H3LMk1',
                            registration: 'HBKOF'
                          }
                        }
                      }
                    },
                    aircraftSettings: {
                      createCheckDialog: {
                        open: false
                      },
                      deleteCheckDialog: {
                        open: false
                      },
                      createFuelTypeDialog: {
                        open: false
                      }
                    }
                  }

                  const store = configureStore()(state)

                  const props = {
                    router: {
                      match: {
                        params: {
                          organizationId: 'my_org',
                          aircraftId: 'o7flC7jw8jmkOfWo8oyA'
                        }
                      }
                    }
                  }

                  const tree = renderIntl(
                    <Provider store={store}>
                      <Router>
                        <AircraftSettingsPage {...props} />
                      </Router>
                    </Provider>
                  ).toJSON()
                  expect(tree).toMatchSnapshot()
                })
              })
            })
          })
        })
      })
    })
  })
})
