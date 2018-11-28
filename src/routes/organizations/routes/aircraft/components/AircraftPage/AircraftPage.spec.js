import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import renderIntl from '../../../../../../testutil/renderIntl'
import AircraftPage from './AircraftPage'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('components', () => {
          describe('AircraftPage', () => {
            it('renders correctly', () => {
              const state = {
                firebase: {
                  auth: {
                    isEmpty: false
                  },
                  profile: {}
                },
                main: {
                  app: {
                    organizations: [{ id: 'my_org' }]
                  }
                },
                firestore: {
                  ordered: {
                    'fligts-o7flC7jw8jmkOfWo8oyA': [
                      {
                        id: 'sStfyLd2XArT7oUZPFDn',
                        departureAerodrome: { name: 'Lommis' },
                        destinationAerodrome: { name: 'Lommis' },
                        blockOffTime: {
                          toDate: () => Date.parse('2018-11-20 10:00')
                        },
                        blockOnTime: {
                          toDate: () => Date.parse('2018-11-20 11:10')
                        },
                        member: {
                          firstname: 'Max',
                          lastname: 'Muster'
                        }
                      },
                      {
                        id: 'sStfyLd2XArT7oUZPFDa',
                        departureAerodrome: { name: 'Lommis' },
                        destinationAerodrome: { name: 'Lommis' },
                        blockOffTime: {
                          toDate: () => Date.parse('2018-11-21 10:00')
                        },
                        blockOnTime: {
                          toDate: () => Date.parse('2018-11-21 11:10')
                        },
                        member: {
                          firstname: 'Hans',
                          lastname: 'Meier'
                        }
                      }
                    ]
                  },
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
                }
              }

              const store = configureStore()(state)

              const props = {
                router: {
                  match: {
                    params: {
                      organizationId: 'my_org'
                    }
                  }
                }
              }

              const tree = renderIntl(
                <Provider store={store}>
                  <Router>
                    <AircraftPage {...props} />
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
