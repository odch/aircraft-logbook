import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import renderIntl from '../../../../../../testutil/renderIntl'
import AircraftDetail from './AircraftDetail'

const StartPage = () => <div>Start Page</div>

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('components', () => {
          describe('AircraftDetail', () => {
            it('renders loading icon if organization not loaded', () => {
              const tree = renderIntl(
                <AircraftDetail
                  organization={undefined}
                  createFlightDialogOpen={false}
                  flightDeleteDialog={{ open: false }}
                  fetchAircrafts={() => {}}
                  fetchFlights={() => {}}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                  openCreateFlightDialog={() => {}}
                  initCreateFlightDialog={() => {}}
                  openDeleteFlightDialog={() => {}}
                  closeDeleteFlightDialog={() => {}}
                  deleteFlight={() => {}}
                  setFlightsPage={() => {}}
                />
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders loading icon if aircraft not loaded', () => {
              const tree = renderIntl(
                <AircraftDetail
                  organization={{ id: 'my_org' }}
                  aircraft={undefined}
                  createFlightDialogOpen={false}
                  flightDeleteDialog={{ open: false }}
                  fetchAircrafts={() => {}}
                  fetchFlights={() => {}}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                  openCreateFlightDialog={() => {}}
                  initCreateFlightDialog={() => {}}
                  openDeleteFlightDialog={() => {}}
                  closeDeleteFlightDialog={() => {}}
                  deleteFlight={() => {}}
                  setFlightsPage={() => {}}
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
                      createFlightDialogOpen={false}
                      flightDeleteDialog={{ open: false }}
                      fetchAircrafts={() => {}}
                      fetchFlights={() => {}}
                      fetchMembers={() => {}}
                      fetchAerodromes={() => {}}
                      openCreateFlightDialog={() => {}}
                      initCreateFlightDialog={() => {}}
                      openDeleteFlightDialog={() => {}}
                      closeDeleteFlightDialog={() => {}}
                      deleteFlight={() => {}}
                      setFlightsPage={() => {}}
                    />
                  </Switch>
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders loading icon if flights not loaded', () => {
              const tree = renderIntl(
                <Router>
                  <AircraftDetail
                    organization={{ id: 'my_org' }}
                    aircraft={{
                      id: 'o7flC7jw8jmkOfWo8oyA',
                      registration: 'HBKFW'
                    }}
                    flights={undefined}
                    flightsPagination={{
                      page: 0,
                      rowsPerPage: 10,
                      rowsCount: 45
                    }}
                    createFlightDialogOpen={false}
                    flightDeleteDialog={{ open: false }}
                    fetchAircrafts={() => {}}
                    fetchFlights={() => {}}
                    fetchMembers={() => {}}
                    fetchAerodromes={() => {}}
                    openCreateFlightDialog={() => {}}
                    initCreateFlightDialog={() => {}}
                    openDeleteFlightDialog={() => {}}
                    closeDeleteFlightDialog={() => {}}
                    deleteFlight={() => {}}
                    setFlightsPage={() => {}}
                  />
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders aircraft detail when everything is loaded', () => {
              const tree = renderIntl(
                <Router>
                  <AircraftDetail
                    organization={{ id: 'my_org' }}
                    aircraft={{
                      id: 'o7flC7jw8jmkOfWo8oyA',
                      registration: 'HBKFW'
                    }}
                    flights={[
                      {
                        id: 'sStfyLd2XArT7oUZPFDn',
                        departureAerodrome: {
                          identification: 'LSZT',
                          timezone: 'Europe/Zurich'
                        },
                        destinationAerodrome: {
                          identification: 'LSZT',
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
                        }
                      }
                    ]}
                    flightsPagination={{
                      page: 0,
                      rowsPerPage: 10,
                      rowsCount: 45
                    }}
                    createFlightDialogOpen={false}
                    flightDeleteDialog={{ open: false }}
                    fetchAircrafts={() => {}}
                    fetchFlights={() => {}}
                    fetchMembers={() => {}}
                    fetchAerodromes={() => {}}
                    openCreateFlightDialog={() => {}}
                    initCreateFlightDialog={() => {}}
                    openDeleteFlightDialog={() => {}}
                    closeDeleteFlightDialog={() => {}}
                    deleteFlight={() => {}}
                    setFlightsPage={() => {}}
                  />
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('calls fetchAircrafts when mounted with organization', () => {
              const fetchAircrafts = jest.fn()

              renderIntl(
                <AircraftDetail
                  organization={{ id: 'my_org' }}
                  aircraft={undefined}
                  createFlightDialogOpen={false}
                  flightDeleteDialog={{ open: false }}
                  fetchAircrafts={fetchAircrafts}
                  fetchFlights={() => {}}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                  openCreateFlightDialog={() => {}}
                  initCreateFlightDialog={() => {}}
                  openDeleteFlightDialog={() => {}}
                  closeDeleteFlightDialog={() => {}}
                  deleteFlight={() => {}}
                  setFlightsPage={() => {}}
                />
              )

              expect(fetchAircrafts).toBeCalledWith('my_org')
            })

            it('calls fetchFlights when mounted with organization and aircraft', () => {
              const fetchFlights = jest.fn()

              renderIntl(
                <AircraftDetail
                  organization={{ id: 'my_org' }}
                  aircraft={{
                    id: 'o7flC7jw8jmkOfWo8oyA',
                    registration: 'HBKFW'
                  }}
                  flightsPagination={{
                    page: 0,
                    rowsPerPage: 10,
                    rowsCount: 45
                  }}
                  createFlightDialogOpen={false}
                  flightDeleteDialog={{ open: false }}
                  fetchAircrafts={() => {}}
                  fetchFlights={fetchFlights}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                  openCreateFlightDialog={() => {}}
                  initCreateFlightDialog={() => {}}
                  openDeleteFlightDialog={() => {}}
                  closeDeleteFlightDialog={() => {}}
                  deleteFlight={() => {}}
                  setFlightsPage={() => {}}
                />
              )

              expect(fetchFlights).toBeCalledWith(
                'my_org',
                'o7flC7jw8jmkOfWo8oyA',
                0,
                10
              )
            })

            it('does not call fetchAircrafts when mounted without organization', () => {
              const fetchAircrafts = jest.fn()

              renderIntl(
                <AircraftDetail
                  organization={undefined}
                  aircraft={undefined}
                  createFlightDialogOpen={false}
                  flightDeleteDialog={{ open: false }}
                  fetchAircrafts={fetchAircrafts}
                  fetchFlights={() => {}}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                  openCreateFlightDialog={() => {}}
                  initCreateFlightDialog={() => {}}
                  openDeleteFlightDialog={() => {}}
                  closeDeleteFlightDialog={() => {}}
                  deleteFlight={() => {}}
                  setFlightsPage={() => {}}
                />
              )

              expect(fetchAircrafts).not.toBeCalled()
            })

            it('does not call fetchFlights when mounted without organization', () => {
              const fetchAircrafts = jest.fn()
              const fetchFlights = jest.fn()

              renderIntl(
                <AircraftDetail
                  organization={undefined}
                  aircraft={undefined}
                  createFlightDialogOpen={false}
                  flightDeleteDialog={{ open: false }}
                  fetchAircrafts={fetchAircrafts}
                  fetchFlights={fetchFlights}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                  openCreateFlightDialog={() => {}}
                  initCreateFlightDialog={() => {}}
                  openDeleteFlightDialog={() => {}}
                  closeDeleteFlightDialog={() => {}}
                  deleteFlight={() => {}}
                  setFlightsPage={() => {}}
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
                  createFlightDialogOpen={false}
                  flightDeleteDialog={{ open: false }}
                  fetchAircrafts={fetchAircrafts}
                  fetchFlights={() => {}}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                  openCreateFlightDialog={() => {}}
                  initCreateFlightDialog={() => {}}
                  openDeleteFlightDialog={() => {}}
                  closeDeleteFlightDialog={() => {}}
                  deleteFlight={() => {}}
                  setFlightsPage={() => {}}
                />
              )

              expect(fetchAircrafts).not.toBeCalled()

              renderer.update(
                <AircraftDetail
                  organization={{ id: 'my_org' }}
                  aircraft={undefined}
                  createFlightDialogOpen={false}
                  flightDeleteDialog={{ open: false }}
                  fetchAircrafts={fetchAircrafts}
                  fetchFlights={() => {}}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                  openCreateFlightDialog={() => {}}
                  initCreateFlightDialog={() => {}}
                  openDeleteFlightDialog={() => {}}
                  closeDeleteFlightDialog={() => {}}
                  deleteFlight={() => {}}
                  setFlightsPage={() => {}}
                />
              )

              expect(fetchAircrafts).toBeCalledWith('my_org')
            })

            it('calls fetchFlights when updated with new aircraft', () => {
              const fetchFlights = jest.fn()

              const renderer = renderIntl(
                <AircraftDetail
                  organization={{ id: 'my_org' }}
                  aircraft={undefined}
                  flightsPagination={{
                    page: 0,
                    rowsPerPage: 10,
                    rowsCount: 45
                  }}
                  createFlightDialogOpen={false}
                  flightDeleteDialog={{ open: false }}
                  fetchAircrafts={() => {}}
                  fetchFlights={fetchFlights}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                  openCreateFlightDialog={() => {}}
                  initCreateFlightDialog={() => {}}
                  openDeleteFlightDialog={() => {}}
                  closeDeleteFlightDialog={() => {}}
                  deleteFlight={() => {}}
                  setFlightsPage={() => {}}
                />
              )

              expect(fetchFlights).not.toBeCalled()

              renderer.update(
                <AircraftDetail
                  organization={{ id: 'my_org' }}
                  aircraft={{
                    id: 'o7flC7jw8jmkOfWo8oyA',
                    registration: 'HBKFW'
                  }}
                  flightsPagination={{
                    page: 0,
                    rowsPerPage: 10,
                    rowsCount: 45
                  }}
                  createFlightDialogOpen={false}
                  flightDeleteDialog={{ open: false }}
                  fetchAircrafts={() => {}}
                  fetchFlights={fetchFlights}
                  fetchMembers={() => {}}
                  fetchAerodromes={() => {}}
                  openCreateFlightDialog={() => {}}
                  initCreateFlightDialog={() => {}}
                  openDeleteFlightDialog={() => {}}
                  closeDeleteFlightDialog={() => {}}
                  deleteFlight={() => {}}
                  setFlightsPage={() => {}}
                />
              )

              expect(fetchFlights).toBeCalledWith(
                'my_org',
                'o7flC7jw8jmkOfWo8oyA',
                0,
                10
              )
            })
          })
        })
      })
    })
  })
})
