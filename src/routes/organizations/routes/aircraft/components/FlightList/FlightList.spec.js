import React from 'react'
import renderIntl from '../../../../../../testutil/renderIntl'
import FlightList from './FlightList'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('components', () => {
          describe('FlightList', () => {
            it('renders correctly', () => {
              const flights = [
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
                },
                {
                  id: 'sStfyLd2XArT7oUZPFDa',
                  departureAerodrome: {
                    identification: 'LSZT',
                    timezone: 'Europe/Zurich'
                  },
                  destinationAerodrome: {
                    identification: 'LSZT',
                    timezone: 'Europe/Zurich'
                  },
                  blockOffTime: {
                    toDate: () => Date.parse('2018-11-21 10:00 GMT+0100')
                  },
                  blockOnTime: {
                    toDate: () => Date.parse('2018-11-21 11:10 GMT+0100')
                  },
                  takeOffTime: {
                    toDate: () => Date.parse('2018-11-20 10:10 GMT+0100')
                  },
                  landingTime: {
                    toDate: () => Date.parse('2018-11-20 11:00 GMT+0100')
                  },
                  pilot: {
                    firstname: 'Hans',
                    lastname: 'Meier'
                  }
                }
              ]

              const tree = renderIntl(
                <FlightList
                  organization={{ id: 'my_org', roles: ['manager'] }}
                  aircraft={{ id: 'my_aircraft' }}
                  flights={flights}
                  flightDeleteDialog={{ open: false }}
                  pagination={{
                    rowsCount: 25,
                    page: 1,
                    rowsPerPage: 10
                  }}
                  initFlightsList={() => {}}
                  openFlightDeleteDialog={() => {}}
                  closeFlightDeleteDialog={() => {}}
                  deleteFlight={() => {}}
                  setFlightsPage={() => {}}
                />
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })
          })
        })
      })
    })
  })
})
