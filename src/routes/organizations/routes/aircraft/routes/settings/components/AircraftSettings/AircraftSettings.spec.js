import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import renderIntl from '../../../../../../../../testutil/renderIntl'
import AircraftSettings from './AircraftSettings'

const StartPage = () => <div>Start Page</div>
const OrganizationPage = () => <div>Organization Page</div>

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('routes', () => {
          describe('settings', () => {
            describe('components', () => {
              describe('AircraftSettings', () => {
                it('renders loading icon if organization not loaded', () => {
                  const tree = renderIntl(
                    <AircraftSettings
                      organization={undefined}
                      fetchAircrafts={() => {}}
                    />
                  ).toJSON()
                  expect(tree).toMatchSnapshot()
                })

                it('renders loading icon if aircraft not loaded', () => {
                  const tree = renderIntl(
                    <AircraftSettings
                      organization={{ id: 'my_org' }}
                      aircraft={undefined}
                      fetchAircrafts={() => {}}
                    />
                  ).toJSON()
                  expect(tree).toMatchSnapshot()
                })

                it('redirects to start page if organization was not found', () => {
                  const tree = renderIntl(
                    <Router>
                      <Switch>
                        <Route exact path="/" component={StartPage} />
                        <AircraftSettings
                          organization={null}
                          fetchAircrafts={() => {}}
                        />
                      </Switch>
                    </Router>
                  ).toJSON()
                  expect(tree).toMatchSnapshot()
                })

                it('redirects to organization page if aircraft was not found', () => {
                  const tree = renderIntl(
                    <Router>
                      <Switch>
                        <Route
                          exact
                          path="/organizations/my_org"
                          component={OrganizationPage}
                        />
                        <AircraftSettings
                          organization={{ id: 'my_org' }}
                          aircraft={null}
                          fetchAircrafts={() => {}}
                        />
                      </Switch>
                    </Router>
                  ).toJSON()
                  expect(tree).toMatchSnapshot()
                })

                it('renders aircraft settings when everything is loaded', () => {
                  const store = configureStore()({
                    firestore: {
                      data: {
                        organizationAircrafts: {
                          o7flC7jw8jmkOfWo8oyA: {
                            settings: {
                              fuelTypes: [
                                { name: 'avgas', description: 'AvGas' },
                                { name: 'mogas', description: 'MoGas' }
                              ]
                            }
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
                  })
                  const tree = renderIntl(
                    <Provider store={store}>
                      <Router>
                        <AircraftSettings
                          organization={{ id: 'my_org' }}
                          aircraft={{
                            id: 'o7flC7jw8jmkOfWo8oyA',
                            registration: 'HBKFW'
                          }}
                          fetchAircrafts={() => {}}
                        />
                      </Router>
                    </Provider>
                  ).toJSON()
                  expect(tree).toMatchSnapshot()
                })

                it('calls fetchAircrafts when mounted with organization', () => {
                  const fetchAircrafts = jest.fn()

                  renderIntl(
                    <AircraftSettings
                      organization={{ id: 'my_org' }}
                      aircraft={undefined}
                      fetchAircrafts={fetchAircrafts}
                    />
                  )

                  expect(fetchAircrafts).toBeCalledWith('my_org')
                })

                it('does not call fetchAircrafts when mounted without organization', () => {
                  const fetchAircrafts = jest.fn()

                  renderIntl(
                    <AircraftSettings
                      organization={undefined}
                      aircraft={undefined}
                      fetchAircrafts={fetchAircrafts}
                    />
                  )

                  expect(fetchAircrafts).not.toBeCalled()
                })

                it('calls fetchAircrafts when updated with new organization', () => {
                  const fetchAircrafts = jest.fn()

                  const renderer = renderIntl(
                    <AircraftSettings
                      organization={undefined}
                      aircraft={undefined}
                      fetchAircrafts={fetchAircrafts}
                    />
                  )

                  expect(fetchAircrafts).not.toBeCalled()

                  renderer.update(
                    <AircraftSettings
                      organization={{ id: 'my_org' }}
                      aircraft={undefined}
                      fetchAircrafts={fetchAircrafts}
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
  })
})
