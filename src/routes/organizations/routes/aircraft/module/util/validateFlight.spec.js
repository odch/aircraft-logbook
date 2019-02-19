import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga/effects'
import validateFlight, { validateSync } from './validateFlight'
import getLastFlight from './getLastFlight'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('util', () => {
          describe('validateFlight', () => {
            const orgId = 'my_org'
            const aircraftId = 'my_aircraft'
            const aircraftSettings1 = {
              engineHoursCounterEnabled: true
            }
            const aircraftSettings2 = {
              engineHoursCounterEnabled: false
            }

            const testFn = async (
              data,
              aircraftSettings,
              name,
              expectedError,
              effectProviders = []
            ) => {
              const { returnValue } = await expectSaga(
                validateFlight,
                data,
                orgId,
                aircraftId,
                aircraftSettings
              )
                .provide(effectProviders)
                .run()
              expect(returnValue[name]).toEqual(expectedError)
            }

            it('should return an error if date is missing', () => {
              return testFn({}, aircraftSettings1, 'date', 'invalid')
            })

            it('should return an error if date is invalid', () => {
              return testFn(
                { date: 'foobar' },
                aircraftSettings1,
                'date',
                'invalid'
              )
            })

            it('should return no error if date is valid', () => {
              return testFn(
                { date: '2019-01-05' },
                aircraftSettings1,
                'date',
                undefined
              )
            })

            it('should return an error if pilot is missing', () => {
              return testFn({}, aircraftSettings1, 'pilot', 'required')
            })

            it('should return no error if pilot is set', () => {
              return testFn(
                { pilot: {} },
                aircraftSettings1,
                'pilot',
                undefined
              )
            })

            it('should return an error if nature is missing', () => {
              return testFn({}, aircraftSettings1, 'nature', 'required')
            })

            it('should return no error if nature is set', () => {
              return testFn(
                {
                  nature: {}
                },
                aircraftSettings1,
                'nature',
                undefined
              )
            })

            it('should return an error if departureAerodrome is missing', () => {
              return testFn(
                {},
                aircraftSettings1,
                'departureAerodrome',
                'required'
              )
            })

            it('should return no error if departureAerodrome is set', () => {
              return testFn(
                {
                  departureAerodrome: {}
                },
                aircraftSettings1,
                'departureAerodrome',
                undefined
              )
            })

            it('should return an error if destinationAerodrome is missing', () => {
              return testFn(
                {},
                aircraftSettings1,
                'destinationAerodrome',
                'required'
              )
            })

            it('should return no error if destinationAerodrome is set', () => {
              return testFn(
                {
                  destinationAerodrome: {}
                },
                aircraftSettings1,
                'destinationAerodrome',
                undefined
              )
            })

            it('should return an error if blockOffTime is missing', () => {
              return testFn({}, aircraftSettings1, 'blockOffTime', 'invalid')
            })

            it('should return an error if blockOffTime is invalid', () => {
              return testFn(
                {
                  blockOffTime: 'foobar'
                },
                aircraftSettings1,
                'blockOffTime',
                'invalid'
              )
            })

            it('should return no error if blockOffTime is valid', () => {
              return testFn(
                { blockOffTime: '2019-05-01 09:00' },
                aircraftSettings1,
                'blockOffTime',
                undefined
              )
            })

            it('should return an error if takeOffTime is missing', () => {
              return testFn({}, aircraftSettings1, 'takeOffTime', 'invalid')
            })

            it('should return an error if takeOffTime is invalid', () => {
              return testFn(
                { takeOffTime: 'foobar' },
                aircraftSettings1,
                'takeOffTime',
                'invalid'
              )
            })

            it('should return no error if takeOffTime is valid', () => {
              return testFn(
                { takeOffTime: '2019-05-01 09:00' },
                aircraftSettings1,
                'takeOffTime',
                undefined
              )
            })

            it('should return an error if landingTime is missing', () => {
              return testFn({}, aircraftSettings1, 'landingTime', 'invalid')
            })

            it('should return an error if landingTime is invalid', () => {
              return testFn(
                { landingTime: 'foobar' },
                aircraftSettings1,
                'landingTime',
                'invalid'
              )
            })

            it('should return no error if landingTime is valid', () => {
              return testFn(
                { landingTime: '2019-05-01 09:00' },
                aircraftSettings1,
                'landingTime',
                undefined
              )
            })

            it('should return an error if blockOnTime is missing', () => {
              return testFn({}, aircraftSettings1, 'blockOnTime', 'invalid')
            })

            it('should return an error if blockOnTime is invalid', () => {
              return testFn(
                { blockOnTime: 'foobar' },
                aircraftSettings1,
                'blockOnTime',
                'invalid'
              )
            })

            it('should return no error if blockOnTime is valid', () => {
              return testFn(
                { blockOnTime: '2019-05-01 09:00' },
                aircraftSettings1,
                'blockOnTime',
                undefined
              )
            })

            it('should return an error if takeOffTime is before blockOffTime', () => {
              return testFn(
                {
                  blockOffTime: '2019-05-01 09:00',
                  takeOffTime: '2019-05-01 08:59'
                },
                aircraftSettings1,
                'takeOffTime',
                'not_before_block_off_time'
              )
            })

            it('should return an error if landingTime is before takeOffTime', () => {
              return testFn(
                {
                  takeOffTime: '2019-05-01 09:00',
                  landingTime: '2019-05-01 08:59'
                },
                aircraftSettings1,
                'landingTime',
                'not_before_take_off_time'
              )
            })

            it('should return an error if blockOnTime is before landingTime', () => {
              return testFn(
                {
                  landingTime: '2019-05-01 09:00',
                  blockOnTime: '2019-05-01 08:59'
                },
                aircraftSettings1,
                'blockOnTime',
                'not_before_landing_time'
              )
            })

            it('should return an error if flight hours start counter is missing', () => {
              return testFn(
                {},
                aircraftSettings1,
                'counters.flightHours.start',
                'required'
              )
            })

            it('should return no error if flight hours start counter is set', () => {
              return testFn(
                {
                  counters: {
                    flightHours: {
                      start: 10000
                    }
                  }
                },
                aircraftSettings1,
                'counters.flightHours.start',
                undefined
              )
            })

            it('should return an error if flight hours end counter is missing', () => {
              return testFn(
                {},
                aircraftSettings1,
                'counters.flightHours.end',
                'required'
              )
            })

            it('should return no error if flight hours end counter is set', () => {
              return testFn(
                {
                  counters: {
                    flightHours: {
                      end: 10000
                    }
                  }
                },
                aircraftSettings1,
                'counters.flightHours.end',
                undefined
              )
            })

            it('should return an error if flight hours end counter is before start counter', () => {
              return testFn(
                {
                  counters: {
                    flightHours: {
                      start: 10000,
                      end: 9999
                    }
                  }
                },
                aircraftSettings1,
                'counters.flightHours.end',
                'not_before_start_counter'
              )
            })

            it('should return an error if engine hours start counter is missing', () => {
              return testFn(
                {},
                aircraftSettings1,
                'counters.engineHours.start',
                'required'
              )
            })

            it('should return no error if engine hours start counter is set', () => {
              return testFn(
                {
                  counters: {
                    engineHours: {
                      start: 10000
                    }
                  }
                },
                aircraftSettings1,
                'counters.engineHours.start',
                undefined
              )
            })

            it('should return an error if engine hours end counter is missing', () => {
              return testFn(
                {},
                aircraftSettings1,
                'counters.engineHours.end',
                'required'
              )
            })

            it('should return no error if engine hours end counter is set', () => {
              return testFn(
                {
                  counters: {
                    engineHours: {
                      end: 10000
                    }
                  }
                },
                aircraftSettings1,
                'counters.engineHours.end',
                undefined
              )
            })

            it('should return an error if engine hours end counter is before start counter', () => {
              return testFn(
                {
                  counters: {
                    engineHours: {
                      start: 10000,
                      end: 9999
                    }
                  }
                },
                aircraftSettings1,
                'counters.engineHours.end',
                'not_before_start_counter'
              )
            })

            it('should return no error if engine hours counter is missing or invalid but not enabled in settings', () => {
              return testFn(
                {},
                aircraftSettings2,
                'counters.engineHours.start',
                undefined
              )
            })

            it('should return an error if landings is missing', () => {
              return testFn({}, aircraftSettings1, 'landings', 'required')
            })

            it('should return an error if landings is invalid', () => {
              return testFn(
                { landings: -1 },
                aircraftSettings1,
                'landings',
                'required'
              )
            })

            it('should return no error if landings is valid', () => {
              return testFn(
                { landings: 1 },
                aircraftSettings1,
                'landings',
                undefined
              )
            })

            it('should return an error if fuelUplift is not a number', () => {
              return testFn(
                { fuelUplift: 'foobar' },
                aircraftSettings1,
                'fuelUplift',
                'invalid'
              )
            })

            it('should return an error if fuelUplift is negative', () => {
              return testFn(
                { fuelUplift: -1 },
                aircraftSettings1,
                'fuelUplift',
                'invalid'
              )
            })

            it('should return an error if fuelUplift is set and fuelType is missing', () => {
              return testFn(
                { fuelUplift: 10 },
                aircraftSettings1,
                'fuelType',
                'required'
              )
            })

            it('should return no error if fuelUplift is not set and fuelType is missing', () => {
              return testFn({}, aircraftSettings1, 'fuelType', undefined)
            })

            it('should return no error for fuelUplift if fuelUplift is set and valid and fuelType is set', () => {
              return testFn(
                {
                  fuelUplift: 10,
                  fuelType: {}
                },
                aircraftSettings1,
                'fuelUplift',
                undefined
              )
            })

            it('should return no error for fuelType if fuelUplift is set and valid and fuelType is set', () => {
              return testFn(
                {
                  fuelUplift: 10,
                  fuelType: {}
                },
                aircraftSettings1,
                'fuelType',
                undefined
              )
            })

            it('should return an error if oilUplift is not a number', () => {
              return testFn(
                { oilUplift: 'foobar' },
                aircraftSettings1,
                'oilUplift',
                'invalid'
              )
            })

            it('should return an error if oilUplift is negative', () => {
              return testFn(
                { oilUplift: -1 },
                aircraftSettings1,
                'oilUplift',
                'invalid'
              )
            })

            it('should return no error if oilUplift is not set', () => {
              return testFn({}, aircraftSettings1, 'oilUplift', undefined)
            })

            it('should return no error if oilUplift is valid', () => {
              return testFn(
                { oilUplift: 1 },
                aircraftSettings1,
                'oilUplift',
                undefined
              )
            })

            it('should return an error if block off time is before block on time of last flight', () => {
              const lastFlight = {
                blockOnTime: { toDate: () => new Date('2019-05-01 09:00') }
              }
              const data = {
                blockOffTime: '2019-05-01 08:59'
              }
              const emptySyncErrors = {}

              return testFn(
                data,
                aircraftSettings1,
                'blockOffTime',
                'not_before_block_on_time_last_flight',
                [
                  [
                    call(
                      validateSync,
                      data,
                      orgId,
                      aircraftId,
                      aircraftSettings1
                    ),
                    emptySyncErrors
                  ],
                  [call(getLastFlight, orgId, aircraftId), lastFlight]
                ]
              )
            })

            it('should return no error if block off time is not before block on time of last flight', () => {
              const lastFlight = {
                blockOnTime: { toDate: () => new Date('2019-05-01 09:00') }
              }
              const data = {
                blockOffTime: '2019-05-01 09:00'
              }
              const emptySyncErrors = {}

              return testFn(
                data,
                aircraftSettings1,
                'blockOffTime',
                undefined,
                [
                  [
                    call(
                      validateSync,
                      data,
                      orgId,
                      aircraftId,
                      aircraftSettings1
                    ),
                    emptySyncErrors
                  ],
                  [call(getLastFlight, orgId, aircraftId), lastFlight]
                ]
              )
            })
          })
        })
      })
    })
  })
})
