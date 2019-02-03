import React from 'react'
import renderIntl from '../../../../../../testutil/renderIntl'
import FlightDetails from './FlightDetails'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('components', () => {
          describe('FlightList', () => {
            describe('FlightDetails', () => {
              it('renders correctly', () => {
                const aircraft = {
                  id: 'o7flC7jw8jmkOfWo8oyA',
                  registration: 'HBKFW',
                  settings: {
                    fuelTypes: [
                      {
                        name: 'mogas_homebase',
                        description: 'MoGas (Homebase)'
                      }
                    ]
                  }
                }

                const flight = {
                  id: 'sStfyLd2XArT7oUZPFDn',
                  departureAerodrome: {
                    name: 'Lommis',
                    identification: 'LSZT'
                  },
                  destinationAerodrome: {
                    name: 'Lommis',
                    identification: 'LSZT'
                  },
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
                  },
                  instructor: {
                    firstname: 'Hans',
                    lastname: 'Keller'
                  },
                  counters: {
                    flightHours: {
                      start: 10156,
                      end: 10243
                    },
                    engineHours: {
                      start: 10489,
                      end: 10604
                    }
                  },
                  nature: 'vp',
                  landings: 1,
                  remarks: 'my\ntest\nremarks',
                  fuelUplift: 58.68,
                  fuelType: 'mogas_homebase',
                  oilUplift: 0.7
                }

                const tree = renderIntl(
                  <FlightDetails aircraft={aircraft} flight={flight} />
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
