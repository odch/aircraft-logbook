jest.mock('../components/AircraftDetail')

import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import AircraftDetail from '../components/AircraftDetail'
import AircraftDetailContainer from './AircraftDetailContainer'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('containers', () => {
          describe('AircraftDetailContainer', () => {
            let wrapper
            let component

            beforeEach(() => {
              jest.resetAllMocks()

              const state = {
                firebase: {
                  auth: {
                    stsTokenManager: {
                      accessToken: 'my-access-token'
                    }
                  }
                },
                main: {
                  app: {
                    organizations: [{ id: 'my_org' }]
                  }
                },
                firestore: {
                  ordered: {
                    'fligts-o7flC7jw8jmkOfWo8oyA-0': [
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
                        pilot: {
                          firstname: 'Max',
                          lastname: 'Muster'
                        },
                        counters: {
                          flights: { end: 2 }
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
                        pilot: {
                          firstname: 'Hans',
                          lastname: 'Meier'
                        },
                        counters: {
                          flights: { end: 1 }
                        }
                      }
                    ]
                  },
                  data: {
                    organizationAircrafts: {
                      o7flC7jw8jmkOfWo8oyA: {
                        registration: 'HBKFW'
                      },
                      BKi7HYAIoe1i75H3LMk1: {
                        registration: 'HBKOF'
                      }
                    }
                  }
                },
                aircraft: {
                  createFlightDialog: {
                    open: false
                  },
                  flights: {
                    page: 0
                  }
                }
              }
              const store = configureStore()(state)

              const props = {
                match: {
                  params: {
                    organizationId: 'my_org',
                    aircraftId: 'o7flC7jw8jmkOfWo8oyA'
                  }
                }
              }

              wrapper = renderer.create(
                <Provider store={store}>
                  <AircraftDetailContainer {...props} />
                </Provider>
              )

              component = wrapper.root.find(el => el.type === AircraftDetail)
            })

            it('should render the component ', () => {
              expect(component).toBeTruthy()
            })

            it('should map state to props', () => {
              const expectedPropKeys = [
                'organization',
                'aircraft',
                'checks',
                'latestCrs',
                'authToken'
              ]

              expect(Object.keys(component.props)).toEqual(
                expect.arrayContaining(expectedPropKeys)
              )
            })

            it('should map dispatch to props', () => {
              const expectedPropKeys = [
                'fetchAircrafts',
                'fetchMembers',
                'fetchAerodromes',
                'fetchChecks',
                'fetchLatestCrs'
              ]

              expect(Object.keys(component.props)).toEqual(
                expect.arrayContaining(expectedPropKeys)
              )
            })
          })
        })
      })
    })
  })
})
