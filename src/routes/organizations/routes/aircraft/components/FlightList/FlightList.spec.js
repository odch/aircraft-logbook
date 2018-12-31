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
                  departureAerodrome: { name: 'Lommis' },
                  destinationAerodrome: { name: 'Lommis' },
                  blockOffTime: {
                    toDate: () => Date.parse('2018-11-20 10:00')
                  },
                  blockOnTime: {
                    toDate: () => Date.parse('2018-11-20 11:10')
                  },
                  takeOffTime: {
                    toDate: () => Date.parse('2018-11-20 10:10')
                  },
                  landingTime: {
                    toDate: () => Date.parse('2018-11-20 11:00')
                  },
                  pilot: {
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
                  takeOffTime: {
                    toDate: () => Date.parse('2018-11-20 10:10')
                  },
                  landingTime: {
                    toDate: () => Date.parse('2018-11-20 11:00')
                  },
                  pilot: {
                    firstname: 'Hans',
                    lastname: 'Meier'
                  }
                }
              ]

              const tree = renderIntl(
                <FlightList
                  flights={flights}
                  flightDeleteDialog={{ open: false }}
                  pagination={{
                    rowsCount: 25,
                    page: 1,
                    rowsPerPage: 10
                  }}
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
