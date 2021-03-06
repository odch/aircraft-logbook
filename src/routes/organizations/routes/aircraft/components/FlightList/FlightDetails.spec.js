import React from 'react'
import renderIntl from '../../../../../../testutil/renderIntl'
import FlightDetails from './FlightDetails'

const counter = (start, end) => ({ start, end })

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('components', () => {
          describe('FlightList', () => {
            describe('FlightDetails', () => {
              const aircraft = {
                id: 'o7flC7jw8jmkOfWo8oyA',
                registration: 'HBKFW',
                settings: {
                  fuelTypes: [
                    {
                      name: 'mogas_homebase',
                      description: 'MoGas (Homebase)'
                    }
                  ],
                  engineHoursCounterEnabled: true,
                  engineTachHoursCounterEnabled: true
                }
              }

              const flight = {
                id: 'sStfyLd2XArT7oUZPFDn',
                version: 1,
                departureAerodrome: {
                  name: 'Lommis',
                  identification: 'LSZT',
                  timezone: 'Europe/Zurich'
                },
                destinationAerodrome: {
                  name: 'Lommis',
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
                },
                instructor: {
                  firstname: 'Hans',
                  lastname: 'Keller'
                },
                counters: {
                  flightHours: counter(10156, 10243),
                  engineHours: counter(10489, 10604),
                  engineTachHours: counter(11665, 11945),
                  landings: counter(234, 235),
                  engineTimeCounter: counter(9431, 9546),
                  engineTachCounter: counter(11352, 11632)
                },
                nature: 'vp',
                landings: 1,
                personsOnBoard: 3,
                remarks: 'my\ntest\nremarks',
                fuelUplift: 58.68,
                fuelType: 'mogas_homebase',
                oilUplift: 0.7,
                preflightCheck: true,
                troublesObservations: 'troubles',
                techlogEntryStatus: 'defect_aog',
                techlogEntryDescription: 'loose screw left main wheel'
              }

              const preflightRecord = {
                id: 'sStfyLd2XArT7oUZPFDn',
                version: 0,
                departureAerodrome: {
                  name: 'Lommis',
                  identification: 'LSZT',
                  timezone: 'Europe/Zurich'
                },
                destinationAerodrome: 0,
                blockOffTime: {
                  toDate: () => Date.parse('2018-11-20 23:59 GMT+0100')
                },
                blockOnTime: null,
                takeOffTime: null,
                landingTime: null,
                pilot: {
                  firstname: 'Max',
                  lastname: 'Muster'
                },
                instructor: {
                  firstname: 'Hans',
                  lastname: 'Keller'
                },
                counters: {
                  flightHours: counter(10156, null),
                  engineHours: counter(10489, null),
                  engineTachHours: counter(11665, null),
                  landings: counter(234, null),
                  engineTimeCounter: counter(9431, null),
                  engineTachCounter: counter(11352, null)
                },
                nature: 'vp',
                landings: null,
                personsOnBoard: 3,
                remarks: 'my\ntest\nremarks',
                fuelUplift: 58.68,
                fuelType: 'mogas_homebase',
                oilUplift: 0.7,
                preflightCheck: true,
                troublesObservations: null,
                techlogEntryStatus: null,
                techlogEntryDescription: null
              }

              const renderToJson = component =>
                renderIntl(component, {
                  createNodeMock: element => {
                    if (element.type === 'textarea') {
                      // mock for TextareaAutosize
                      return document.createElement('textarea')
                    }
                    return null
                  }
                }).toJSON()

              it('renders correctly', () => {
                const tree = renderToJson(
                  <FlightDetails aircraft={aircraft} flight={flight} />
                )
                expect(tree).toMatchSnapshot()
              })

              it('does not render engine hours if counter not enabled', () => {
                const testAircraft = {
                  ...aircraft,
                  settings: {
                    ...aircraft.settings,
                    engineHoursCounterEnabled: false
                  }
                }
                const tree = renderToJson(
                  <FlightDetails aircraft={testAircraft} flight={flight} />
                )
                expect(tree).toMatchSnapshot()
              })

              it('does not render engine tach hours if counter not enabled', () => {
                const testAircraft = {
                  ...aircraft,
                  settings: {
                    ...aircraft.settings,
                    engineTachHoursCounterEnabled: false
                  }
                }
                const tree = renderToJson(
                  <FlightDetails aircraft={testAircraft} flight={flight} />
                )
                expect(tree).toMatchSnapshot()
              })

              it('renders engine hours with one digit if setting set to 1', () => {
                const testAircraft = {
                  ...aircraft,
                  settings: {
                    ...aircraft.settings,
                    engineHoursCounterFractionDigits: 1
                  }
                }
                const tree = renderToJson(
                  <FlightDetails aircraft={testAircraft} flight={flight} />
                )
                expect(tree).toMatchSnapshot()
              })

              it('renders engine tach hours with one digit if setting set to 1', () => {
                const testAircraft = {
                  ...aircraft,
                  settings: {
                    ...aircraft.settings,
                    engineTachHoursCounterFractionDigits: 1
                  }
                }
                const tree = renderToJson(
                  <FlightDetails aircraft={testAircraft} flight={flight} />
                )
                expect(tree).toMatchSnapshot()
              })

              it('renders correctly for preflight record', () => {
                const tree = renderToJson(
                  <FlightDetails aircraft={aircraft} flight={preflightRecord} />
                )
                expect(tree).toMatchSnapshot()
              })
            })
          })
        })
      })
    })
  })
})
