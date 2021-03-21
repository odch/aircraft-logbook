import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import renderIntl from '../../../../../../testutil/renderIntl'
import AircraftDetail from './AircraftDetail'

const StartPage = () => <div>Start Page</div>

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('components', () => {
          describe('AircraftDetail', () => {
            const store = configureStore()({
              aircraft: {
                flights: {
                  page: 0
                },
                createFlightDialog: {
                  open: false
                },
                createCorrectionFlightDialog: {
                  open: false
                },
                deleteFlightDialog: {
                  open: false
                },
                createTechlogEntryDialog: {
                  open: false
                },
                createTechlogEntryActionDialog: {
                  open: false
                }
              },
              firestore: {
                ordered: {
                  'flights-o7flC7jw8jmkOfWo8oyA-0': [
                    {
                      id: 'sStfyLd2XArT7oUZPFDn',
                      departureAerodrome: {
                        identification: 'LSZT',
                        name: 'Lommis',
                        timezone: 'Europe/Zurich'
                      },
                      destinationAerodrome: {
                        identification: 'LSZT',
                        name: 'Lommis',
                        timezone: 'Europe/Zurich'
                      },
                      blockOffTime: {
                        toDate: () => Date.parse('2018-11-20 10:00 GMT+0100')
                      },
                      blockOnTime: {
                        toDate: () => Date.parse('2018-11-20 11:10 GMT+0100')
                      },
                      takeOffTime: {
                        toDate: () => Date.parse('2018-11-20 10:10 GMT+0100')
                      },
                      landingTime: {
                        toDate: () => Date.parse('2018-11-20 11:00 GMT+0100')
                      },
                      pilot: {
                        firstname: 'Max',
                        lastname: 'Muster'
                      },
                      counters: {
                        flights: { end: 1 },
                        landings: { end: 1 },
                        flightHours: { end: 100 }
                      }
                    }
                  ],
                  'techlog-o7flC7jw8jmkOfWo8oyA-open': [
                    {
                      number: '1',
                      description: 'Schraube am Bugfahrwerk locker',
                      author: {
                        firstname: 'Hans',
                        lastname: 'Meier'
                      },
                      currentStatus: 'defect_aog',
                      timestamp: {
                        toDate: () => Date.parse('2020-06-25 10:54 GMT+0100')
                      }
                    }
                  ]
                }
              },
              firebase: {
                auth: {
                  stsTokenManager: {
                    accessToken: 'xyz'
                  }
                }
              }
            })

            it('renders loading icon if organization not loaded', () => {
              const tree = renderIntl(
                <AircraftDetail
                  organization={undefined}
                  fetchAircrafts={() => {}}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                />
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders loading icon if aircraft not loaded', () => {
              const tree = renderIntl(
                <AircraftDetail
                  organization={{ id: 'my_org' }}
                  aircraft={undefined}
                  fetchAircrafts={() => {}}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                />
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('redirects to start page if organization was not found', () => {
              const tree = renderIntl(
                <Router>
                  <Switch>
                    <Route exact path="/" component={StartPage} />
                    <AircraftDetail
                      organization={null}
                      fetchAircrafts={() => {}}
                      fetchMembers={() => {}}
                      fetchAerodromes={() => {}}
                    />
                  </Switch>
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders aircraft detail when everything is loaded', () => {
              const tree = renderIntl(
                <Provider store={store}>
                  <Router>
                    <AircraftDetail
                      organization={{ id: 'my_org', roles: ['manager'] }}
                      aircraft={{
                        id: 'o7flC7jw8jmkOfWo8oyA',
                        registration: 'HBKFW',
                        settings: {
                          techlogEnabled: true
                        }
                      }}
                      checks={[]}
                      latestCrs={{
                        number: '0',
                        description: 'My CRS',
                        author: {
                          firstname: 'Gerd',
                          lastname: 'Keller'
                        },
                        currentStatus: 'crs',
                        timestamp: {
                          toDate: () => Date.parse('2020-06-20 11:14 GMT+0100')
                        }
                      }}
                      fetchAircrafts={() => {}}
                      fetchMembers={() => {}}
                      fetchAerodromes={() => {}}
                      fetchChecks={() => {}}
                      fetchLatestCrs={() => {}}
                    />
                  </Router>
                </Provider>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders aircraft detail with expired notification', () => {
              const tree = renderIntl(
                <Provider store={store}>
                  <Router>
                    <AircraftDetail
                      organization={{
                        id: 'my_org',
                        roles: ['manager'],
                        expired: true
                      }}
                      aircraft={{
                        id: 'o7flC7jw8jmkOfWo8oyA',
                        registration: 'HBKFW',
                        settings: {
                          techlogEnabled: true
                        }
                      }}
                      checks={[]}
                      latestCrs={{
                        number: '0',
                        description: 'My CRS',
                        author: {
                          firstname: 'Gerd',
                          lastname: 'Keller'
                        },
                        currentStatus: 'crs',
                        timestamp: {
                          toDate: () => Date.parse('2020-06-20 11:14 GMT+0100')
                        }
                      }}
                      fetchAircrafts={() => {}}
                      fetchMembers={() => {}}
                      fetchAerodromes={() => {}}
                      fetchChecks={() => {}}
                      fetchLatestCrs={() => {}}
                    />
                  </Router>
                </Provider>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('calls fetchAircrafts when mounted with organization', () => {
              const fetchAircrafts = jest.fn()

              renderIntl(
                <AircraftDetail
                  organization={{ id: 'my_org' }}
                  aircraft={undefined}
                  fetchAircrafts={fetchAircrafts}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                />
              )

              expect(fetchAircrafts).toBeCalledWith('my_org')
            })

            it('does not call fetchAircrafts when mounted without organization', () => {
              const fetchAircrafts = jest.fn()

              renderIntl(
                <AircraftDetail
                  organization={undefined}
                  aircraft={undefined}
                  fetchAircrafts={fetchAircrafts}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                />
              )

              expect(fetchAircrafts).not.toBeCalled()
            })

            it('calls fetchAircrafts when updated with new organization', () => {
              const fetchAircrafts = jest.fn()

              const renderer = renderIntl(
                <AircraftDetail
                  organization={undefined}
                  aircraft={undefined}
                  fetchAircrafts={fetchAircrafts}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                />
              )

              expect(fetchAircrafts).not.toBeCalled()

              renderer.update(
                <AircraftDetail
                  organization={{ id: 'my_org' }}
                  aircraft={undefined}
                  fetchAircrafts={fetchAircrafts}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                />
              )

              expect(fetchAircrafts).toBeCalledWith('my_org')
            })
          })
        })
      })
    })
  })
})
