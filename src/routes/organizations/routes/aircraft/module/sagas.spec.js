import { all, takeEvery, fork, call, put } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import moment from 'moment'
import { getFirestore } from '../../../../../util/firebase'
import { addDoc, updateDoc } from '../../../../../util/firestoreUtils'
import * as actions from './actions'
import * as sagas from './sagas'
import { getAerodrome } from './sagas'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('sagas', () => {
          describe('fetchFlights', () => {
            it('should load the flights of an aircraft', () => {
              const fetchFlightsAction = actions.fetchFlights(
                'my_org',
                'o7flC7jw8jmkOfWo8oyA',
                0,
                10
              )

              const generator = sagas.fetchFlights(fetchFlightsAction)

              expect(generator.next().value).toEqual(
                call(
                  sagas.getStartFlightDocument,
                  'my_org',
                  'o7flC7jw8jmkOfWo8oyA',
                  0
                )
              )

              expect(generator.next(null).value).toEqual(call(getFirestore))

              const firestore = {
                get: () => {}
              }
              expect(generator.next(firestore).value).toEqual(
                call(
                  firestore.get,
                  {
                    collection: 'organizations',
                    doc: 'my_org',
                    subcollections: [
                      {
                        collection: 'aircrafts',
                        doc: 'o7flC7jw8jmkOfWo8oyA',
                        subcollections: [
                          {
                            collection: 'flights'
                          }
                        ]
                      }
                    ],
                    where: ['deleted', '==', false],
                    orderBy: ['blockOffTime', 'desc'],
                    startAfter: null,
                    limit: 10,
                    storeAs: 'flights-o7flC7jw8jmkOfWo8oyA-0',
                    populate: [
                      'departureAerodrome',
                      'destinationAerodrome',
                      'pilot'
                    ]
                  },
                  {}
                )
              )

              expect(generator.next().done).toEqual(true)
            })
          })

          describe('getLastFlight', () => {
            const organizationId = 'my_org'
            const aircraftId = 'o7flC7jw8jmkOfWo8oyA'

            const queryOptions = {
              collection: 'organizations',
              doc: organizationId,
              subcollections: [
                {
                  collection: 'aircrafts',
                  doc: aircraftId,
                  subcollections: [
                    {
                      collection: 'flights'
                    }
                  ]
                }
              ],
              where: ['deleted', '==', false],
              orderBy: ['blockOffTime', 'desc'],
              limit: 1
            }

            const firestore = {
              get: () => {}
            }

            it('should return the last flight if there is one', () => {
              const lastFlight = {
                remarks: 'test flight'
              }

              const lastFlightQuerySnapshot = {
                empty: false,
                docs: [
                  {
                    data: () => lastFlight
                  }
                ]
              }

              return expectSaga(sagas.getLastFlight, organizationId, aircraftId)
                .provide([
                  [call(getFirestore), firestore],
                  [
                    call(firestore.get, queryOptions, {}),
                    lastFlightQuerySnapshot
                  ]
                ])
                .returns(lastFlight)
                .run()
            })

            it('should return null if there is no last flight', () => {
              const lastFlightQuerySnapshot = {
                empty: true
              }

              return expectSaga(sagas.getLastFlight, organizationId, aircraftId)
                .provide([
                  [call(getFirestore), firestore],
                  [
                    call(firestore.get, queryOptions, {}),
                    lastFlightQuerySnapshot
                  ]
                ])
                .returns(null)
                .run()
            })
          })

          describe('getDestinationAerodrome', () => {
            it('should return null if destination aerodrome not set', () => {
              expect(sagas.getDestinationAerodrome({})).resolves.toEqual(null)
            })

            it('should return the destination aerodrome data if set', () => {
              expect(
                sagas.getDestinationAerodrome({
                  destinationAerodrome: {
                    id: 'aerodromeid',
                    get: () =>
                      Promise.resolve({
                        data: () => ({
                          name: 'Lommis',
                          identification: 'LSZT'
                        })
                      })
                  }
                })
              ).resolves.toEqual({
                id: 'aerodromeid',
                name: 'Lommis',
                identification: 'LSZT'
              })
            })
          })

          describe('mergeDateAndTime', () => {
            it('should create a JS date for the given date and time string', () => {
              expect(
                sagas.mergeDateAndTime(
                  '2018-12-15',
                  '2018-12-14 14:00',
                  'Europe/Zurich'
                )
              ).toEqual(moment('2018-12-15T14:00+01').toDate())
            })
          })

          describe('createFlight', () => {
            it('should save a new flight', () => {
              const organizationId = 'my-org'
              const aircraftId = 'o7flC7jw8jmkOfWo8oyA'

              const data = {
                pilot: { value: 'pilot-id' },
                instructor: { value: 'instructor-id' },
                nature: { value: 'vp' },
                departureAerodrome: { value: 'dep-ad-id' },
                destinationAerodrome: { value: 'dest-ad-id' },
                date: '2018-12-15',
                blockOffTime: '2018-12-15 10:00',
                takeOffTime: '2018-12-15 10:05',
                landingTime: '2018-12-15 10:35',
                blockOnTime: '2018-12-15 10:40',
                counters: {
                  flightHours: {
                    start: 45780,
                    end: 45830
                  },
                  engineHours: {
                    start: 50145,
                    end: 50612
                  }
                },
                landings: 3,
                fuelUplift: 5789,
                fuelType: { value: 'avgas_homebase' },
                oilUplift: 245,
                remarks: 'bemerkung zeile 1\nzeile2'
              }

              const action = actions.createFlight(
                organizationId,
                aircraftId,
                data
              )

              const generator = sagas.createFlight(action)

              expect(generator.next().value).toEqual(
                put(actions.setCreateFlightDialogSubmitting())
              )

              expect(generator.next().value).toEqual(
                call(sagas.validateFlight, data)
              )

              const validationErrors = {}

              expect(generator.next(validationErrors).value).toEqual(
                call(sagas.getCurrentMember)
              )

              const currentMember = {
                id: 'member-id'
              }
              const owner = { ref: 'owner-ref' }
              const pilot = { ref: 'pilot-ref' }
              const instructor = { ref: 'instructor-ref' }
              const departureAerodrome = {
                ref: 'dep-ad-ref',
                data: () => ({
                  timezone: 'Europe/Zurich'
                })
              }
              const destinationAerodrome = {
                ref: 'dest-ad-ref',
                data: () => ({
                  timezone: 'Europe/Zurich'
                })
              }

              expect(generator.next(currentMember).value).toEqual(
                call(sagas.getMember, organizationId, currentMember.id)
              )
              expect(generator.next(owner).value).toEqual(
                call(sagas.getMember, organizationId, data.pilot.value)
              )
              expect(generator.next(pilot).value).toEqual(
                call(sagas.getMember, organizationId, data.instructor.value)
              )
              expect(generator.next(instructor).value).toEqual(
                call(getAerodrome, data.departureAerodrome.value)
              )
              expect(generator.next(departureAerodrome).value).toEqual(
                call(getAerodrome, data.destinationAerodrome.value)
              )

              expect(generator.next(destinationAerodrome).value).toEqual(
                call(
                  addDoc,
                  [
                    'organizations',
                    organizationId,
                    'aircrafts',
                    aircraftId,
                    'flights'
                  ],
                  {
                    deleted: false,
                    owner: 'owner-ref',
                    pilot: 'pilot-ref',
                    instructor: 'instructor-ref',
                    nature: 'vp',
                    departureAerodrome: 'dep-ad-ref',
                    destinationAerodrome: 'dest-ad-ref',
                    blockOffTime: new Date('2018-12-15T09:00:00.000Z'),
                    takeOffTime: new Date('2018-12-15T09:05:00.000Z'),
                    landingTime: new Date('2018-12-15T09:35:00.000Z'),
                    blockOnTime: new Date('2018-12-15T09:40:00.000Z'),
                    counters: {
                      flightHours: {
                        start: 45780,
                        end: 45830
                      },
                      engineHours: {
                        start: 50145,
                        end: 50612
                      }
                    },
                    landings: 3,
                    fuelUplift: 57.89,
                    fuelUnit: 'litre',
                    fuelType: 'avgas_homebase',
                    oilUplift: 2.45,
                    oilUnit: 'litre',
                    remarks: 'bemerkung zeile 1\nzeile2'
                  }
                )
              )

              expect(generator.next().value).toEqual(
                put(actions.fetchFlights(organizationId, aircraftId))
              )
              expect(generator.next().value).toEqual(
                put(actions.createFlightSuccess())
              )

              expect(generator.next().done).toEqual(true)
            })

            it('should set the validation errors to state if invalid', () => {
              const organizationId = 'my-org'
              const aircraftId = 'o7flC7jw8jmkOfWo8oyA'

              const data = {
                // invalid and missing data
              }

              const action = actions.createFlight(
                organizationId,
                aircraftId,
                data
              )

              const generator = sagas.createFlight(action)

              expect(generator.next().value).toEqual(
                put(actions.setCreateFlightDialogSubmitting())
              )

              expect(generator.next().value).toEqual(
                call(sagas.validateFlight, data)
              )

              const validationErrors = {
                pilot: 'required',
                date: 'invalid'
              }

              expect(generator.next(validationErrors).value).toEqual(
                put(actions.setFlightValidationErrors(validationErrors))
              )

              expect(generator.next().done).toEqual(true)
            })
          })

          describe('validateFlight', () => {
            it('should return an error if date is missing', () => {
              const errors = sagas.validateFlight({})
              expect(errors.date).toEqual('invalid')
            })

            it('should return an error if date is invalid', () => {
              const errors = sagas.validateFlight({
                date: 'foobar'
              })
              expect(errors.date).toEqual('invalid')
            })

            it('should return no error if date is valid', () => {
              const errors = sagas.validateFlight({
                date: '2019-01-05'
              })
              expect(errors.date).toEqual(undefined)
            })

            it('should return an error if pilot is missing', () => {
              const errors = sagas.validateFlight({})
              expect(errors.pilot).toEqual('required')
            })

            it('should return no error if pilot is set', () => {
              const errors = sagas.validateFlight({
                pilot: {}
              })
              expect(errors.pilot).toEqual(undefined)
            })

            it('should return an error if nature is missing', () => {
              const errors = sagas.validateFlight({})
              expect(errors.nature).toEqual('required')
            })

            it('should return no error if nature is set', () => {
              const errors = sagas.validateFlight({
                nature: {}
              })
              expect(errors.nature).toEqual(undefined)
            })

            it('should return an error if departureAerodrome is missing', () => {
              const errors = sagas.validateFlight({})
              expect(errors.departureAerodrome).toEqual('required')
            })

            it('should return no error if departureAerodrome is set', () => {
              const errors = sagas.validateFlight({
                departureAerodrome: {}
              })
              expect(errors.departureAerodrome).toEqual(undefined)
            })

            it('should return an error if destinationAerodrome is missing', () => {
              const errors = sagas.validateFlight({})
              expect(errors.destinationAerodrome).toEqual('required')
            })

            it('should return no error if destinationAerodrome is set', () => {
              const errors = sagas.validateFlight({
                destinationAerodrome: {}
              })
              expect(errors.destinationAerodrome).toEqual(undefined)
            })

            it('should return an error if blockOffTime is missing', () => {
              const errors = sagas.validateFlight({})
              expect(errors.blockOffTime).toEqual('invalid')
            })

            it('should return an error if blockOffTime is invalid', () => {
              const errors = sagas.validateFlight({
                blockOffTime: 'foobar'
              })
              expect(errors.blockOffTime).toEqual('invalid')
            })

            it('should return no error if blockOffTime is valid', () => {
              const errors = sagas.validateFlight({
                blockOffTime: '2019-05-01 09:00'
              })
              expect(errors.blockOffTime).toEqual(undefined)
            })

            it('should return an error if takeOffTime is missing', () => {
              const errors = sagas.validateFlight({})
              expect(errors.takeOffTime).toEqual('invalid')
            })

            it('should return an error if takeOffTime is invalid', () => {
              const errors = sagas.validateFlight({
                takeOffTime: 'foobar'
              })
              expect(errors.takeOffTime).toEqual('invalid')
            })

            it('should return no error if takeOffTime is valid', () => {
              const errors = sagas.validateFlight({
                takeOffTime: '2019-05-01 09:00'
              })
              expect(errors.takeOffTime).toEqual(undefined)
            })

            it('should return an error if landingTime is missing', () => {
              const errors = sagas.validateFlight({})
              expect(errors.landingTime).toEqual('invalid')
            })

            it('should return an error if landingTime is invalid', () => {
              const errors = sagas.validateFlight({
                landingTime: 'foobar'
              })
              expect(errors.landingTime).toEqual('invalid')
            })

            it('should return no error if landingTime is valid', () => {
              const errors = sagas.validateFlight({
                landingTime: '2019-05-01 09:00'
              })
              expect(errors.landingTime).toEqual(undefined)
            })

            it('should return an error if blockOnTime is missing', () => {
              const errors = sagas.validateFlight({})
              expect(errors.blockOnTime).toEqual('invalid')
            })

            it('should return an error if blockOnTime is invalid', () => {
              const errors = sagas.validateFlight({
                blockOnTime: 'foobar'
              })
              expect(errors.blockOnTime).toEqual('invalid')
            })

            it('should return no error if blockOnTime is valid', () => {
              const errors = sagas.validateFlight({
                blockOnTime: '2019-05-01 09:00'
              })
              expect(errors.blockOnTime).toEqual(undefined)
            })

            it('should return an error if landings is missing', () => {
              const errors = sagas.validateFlight({})
              expect(errors.landings).toEqual('required')
            })

            it('should return an error if landings is invalid', () => {
              const errors = sagas.validateFlight({
                landings: -1
              })
              expect(errors.landings).toEqual('required')
            })

            it('should return no error if landings is valid', () => {
              const errors = sagas.validateFlight({
                landings: 1
              })
              expect(errors.landings).toEqual(undefined)
            })

            it('should return an error if fuelUplift is not a number', () => {
              const errors = sagas.validateFlight({
                fuelUplift: 'foobar'
              })
              expect(errors.fuelUplift).toEqual('invalid')
            })

            it('should return an error if fuelUplift is negative', () => {
              const errors = sagas.validateFlight({
                fuelUplift: -1
              })
              expect(errors.fuelUplift).toEqual('invalid')
            })

            it('should return an error if fuelUplift is set and fuelType is missing', () => {
              const errors = sagas.validateFlight({
                fuelUplift: 10
              })
              expect(errors.fuelType).toEqual('required')
            })

            it('should return no error if fuelUplift is not set and fuelType is missing', () => {
              const errors = sagas.validateFlight({})
              expect(errors.fuelType).toEqual(undefined)
            })

            it('should return no error if fuelUplift is set and valid and fuelType is set', () => {
              const errors = sagas.validateFlight({
                fuelUplift: 10,
                fuelType: {}
              })
              expect(errors.fuelUplift).toEqual(undefined)
              expect(errors.fuelType).toEqual(undefined)
            })

            it('should return an error if oilUplift is not a number', () => {
              const errors = sagas.validateFlight({
                oilUplift: 'foobar'
              })
              expect(errors.oilUplift).toEqual('invalid')
            })

            it('should return an error if oilUplift is negative', () => {
              const errors = sagas.validateFlight({
                oilUplift: -1
              })
              expect(errors.oilUplift).toEqual('invalid')
            })

            it('should return no error if oilUplift is not set', () => {
              const errors = sagas.validateFlight({})
              expect(errors.oilUplift).toEqual(undefined)
            })

            it('should return no error if oilUplift is valid', () => {
              const errors = sagas.validateFlight({
                oilUplift: 1
              })
              expect(errors.oilUplift).toEqual(undefined)
            })
          })

          describe('initCreateFlightDialog', () => {
            it('should set the default values for the new flight', () => {
              const orgId = 'my_org'
              const aircraftId = 'o7flC7jw8jmkOfWo8oyA'

              const action = actions.initCreateFlightDialog(orgId, aircraftId)

              const today = moment().format('YYYY-MM-DD')

              const expectedDefaultValues = {
                initialized: true,
                date: today,
                pilot: {
                  value: 'memberid',
                  label: 'Müller Max'
                },
                departureAerodrome: {
                  value: 'aerodromeid',
                  label: 'Lommis (LSZT)'
                },
                counters: {
                  flightHours: {
                    start: 10250
                  },
                  engineHours: {
                    start: 10502
                  }
                }
              }

              const currentMember = {
                id: 'memberid',
                lastname: 'Müller',
                firstname: 'Max'
              }
              const lastFlight = {
                counters: {
                  flightHours: {
                    start: 10145,
                    end: 10250
                  },
                  engineHours: {
                    start: 10378,
                    end: 10502
                  }
                }
              }
              const destinationAerodrome = {
                id: 'aerodromeid',
                name: 'Lommis',
                identification: 'LSZT'
              }

              return expectSaga(sagas.initCreateFlightDialog, action)
                .provide([
                  [call(sagas.getCurrentMember), currentMember],
                  [call(sagas.getLastFlight, orgId, aircraftId), lastFlight],
                  [
                    call(sagas.getDestinationAerodrome, lastFlight),
                    destinationAerodrome
                  ]
                ])
                .put(
                  actions.updateCreateFlightDialogData(expectedDefaultValues)
                )
                .run()
            })
          })

          describe('deleteFlight', () => {
            it('should delete a flight', () => {
              const aircraftId = 'o7flC7jw8jmkOfWo8oyA'
              const flightId = 'flight-id'

              const action = actions.deleteFlight(
                'my_org',
                aircraftId,
                flightId
              )

              const generator = sagas.deleteFlight(action)

              expect(generator.next().value).toEqual(
                call(
                  updateDoc,
                  [
                    'organizations',
                    'my_org',
                    'aircrafts',
                    aircraftId,
                    'flights',
                    flightId
                  ],
                  {
                    deleted: true
                  }
                )
              )

              expect(generator.next().value).toEqual(
                put(actions.fetchFlights('my_org', aircraftId))
              )
              expect(generator.next().value).toEqual(
                put(actions.closeDeleteFlightDialog())
              )

              expect(generator.next().done).toEqual(true)
            })
          })

          describe('getCurrentMember', () => {
            it('should return the current member', () => {
              const member1 = {
                firstname: 'Max',
                lastname: 'Muster',
                user: undefined
              }
              const member2 = {
                firstname: 'Hans',
                lastname: 'Meier',
                user: {
                  id: 'o7flC7jw8j'
                }
              }
              return expectSaga(sagas.getCurrentMember)
                .withState({
                  firebase: {
                    auth: {
                      uid: 'o7flC7jw8j'
                    }
                  },
                  firestore: {
                    ordered: {
                      organizationMembers: [member1, member2]
                    }
                  }
                })
                .returns(member2)
                .run()
            })
          })

          describe('default', () => {
            it('should fork all sagas', () => {
              const generator = sagas.default()

              expect(generator.next().value).toEqual(
                all([
                  fork(takeEvery, actions.FETCH_FLIGHTS, sagas.fetchFlights),
                  fork(takeEvery, actions.CREATE_FLIGHT, sagas.createFlight),
                  fork(
                    takeEvery,
                    actions.INIT_CREATE_FLIGHT_DIALOG,
                    sagas.initCreateFlightDialog
                  ),
                  fork(takeEvery, actions.DELETE_FLIGHT, sagas.deleteFlight)
                ])
              )
            })
          })
        })
      })
    })
  })
})
