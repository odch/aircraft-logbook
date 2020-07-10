import { all, takeEvery, call, put, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import moment from 'moment'
import { callFunction, getFirestore } from '../../../../../util/firebase'
import { addDoc, updateDoc } from '../../../../../util/firestoreUtils'
import * as actions from './actions'
import * as sagas from './sagas'
import getLastFlight from './util/getLastFlight'
import { validateSync, validateAsync } from './util/validateFlight'
import { fetchAerodromes } from '../../../module'
import { fetchAircrafts } from '../../../module/actions'

const counter = (start, end) => ({ start, end })

const getFromMap = map => name => map[name]

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('sagas', () => {
          describe('initFlightsList', () => {
            it('should init the flight list state', () => {
              const action = actions.initFlightsList(
                'my_org',
                'o7flC7jw8jmkOfWo8oyA',
                5
              )
              return expectSaga(sagas.initFlightsList, action)
                .provide([[call(sagas.fetchFlights)]])
                .put(
                  actions.setFlightsParams('my_org', 'o7flC7jw8jmkOfWo8oyA', 5)
                )
                .call(sagas.fetchFlights)
                .run()
            })
          })

          describe('changeFlightsPage', () => {
            it('should change the page of the flight list', () => {
              const action = actions.changeFlightsPage(2)
              return expectSaga(sagas.changeFlightsPage, action)
                .provide([[call(sagas.fetchFlights)]])
                .put(actions.setFlightsPage(2))
                .call(sagas.fetchFlights)
                .run()
            })
          })

          describe('fetchFlights', () => {
            it('should load the flights of an aircraft', () => {
              const fetchFlightsAction = actions.fetchFlights()

              const generator = sagas.fetchFlights(fetchFlightsAction)

              expect(generator.next().value).toEqual(
                select(sagas.aircraftFlightsViewSelector)
              )

              const aircraftFlightsView = {
                organizationId: 'my_org',
                aircraftId: 'o7flC7jw8jmkOfWo8oyA',
                page: 0,
                rowsPerPage: 10
              }

              expect(generator.next(aircraftFlightsView).value).toEqual(
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
                      'pilot',
                      'instructor'
                    ]
                  },
                  {}
                )
              )

              expect(generator.next().done).toEqual(true)
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
                date: '2018-12-13',
                blockOffTime: '2018-12-15 10:00',
                takeOffTime: '2018-12-15 10:05',
                landingTime: '2018-12-15 10:35',
                blockOnTime: '2018-12-15 10:40',
                counters: {
                  flightTimeCounter: counter(45780, 45830),
                  engineTimeCounter: counter(50145, 50612),
                  flightHours: { start: 58658 },
                  engineHours: { start: 65865 },
                  flights: { start: 464 },
                  landings: { start: 3846 }
                },
                landings: 3,
                fuelUplift: 5789,
                fuelType: { value: 'avgas_homebase' },
                oilUplift: 245,
                troublesObservations: 'troubles',
                techlogEntryStatus: { value: 'not_airworthy' },
                techlogEntryDescription: ' Schraube am Bugfahrwerkt locker\n   '
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
                select(sagas.aircraftSettingsSelector, aircraftId)
              )

              const aircraftSettings = {
                engineHoursCounterEnabled: true
              }

              expect(generator.next(aircraftSettings).value).toEqual(
                call(
                  validateSync,
                  data,
                  organizationId,
                  aircraftId,
                  aircraftSettings
                )
              )

              const validationErrors = {}

              expect(generator.next(validationErrors).value).toEqual(
                call(
                  sagas.getAerodrome,
                  organizationId,
                  data.departureAerodrome.value
                )
              )

              const currentMember = {
                id: 'member-id'
              }
              const owner = { ref: 'owner-ref' }
              const pilot = {
                exists: true,
                ref: 'pilot-ref',
                id: 'pilot-id',
                get: getFromMap({
                  firstname: 'Max',
                  lastname: 'Superpilot',
                  nr: '9999'
                })
              }
              const instructor = {
                exists: true,
                ref: 'instructor-ref',
                id: 'instructor-id',
                get: getFromMap({
                  firstname: 'Hans',
                  lastname: 'Superfluglehrer'
                })
              }
              const departureAerodrome = {
                ref: 'dep-ad-ref',
                id: 'dep-ad-id',
                get: getFromMap({
                  identification: 'LSZT',
                  name: 'Lommis',
                  timezone: 'Europe/Zurich'
                })
              }
              const destinationAerodrome = {
                ref: 'dest-ad-ref',
                id: 'dest-ad-id',
                get: getFromMap({
                  identification: 'LSPV',
                  name: 'Wangen-Lachen',
                  timezone: 'Europe/Zurich'
                })
              }
              const dataWithMergedDateAndTime = {
                ...data,
                blockOffTime: new Date('2018-12-13T09:00:00.000Z'),
                takeOffTime: new Date('2018-12-13T09:05:00.000Z'),
                landingTime: new Date('2018-12-13T09:35:00.000Z'),
                blockOnTime: new Date('2018-12-13T09:40:00.000Z')
              }

              expect(generator.next(departureAerodrome).value).toEqual(
                call(
                  sagas.getAerodrome,
                  organizationId,
                  data.destinationAerodrome.value
                )
              )
              expect(generator.next(destinationAerodrome).value).toEqual(
                call(
                  validateAsync,
                  dataWithMergedDateAndTime,
                  organizationId,
                  aircraftId
                )
              )
              expect(generator.next(validationErrors).value).toEqual(
                call(sagas.getCurrentMember)
              )
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
                    pilot: {
                      firstname: 'Max',
                      lastname: 'Superpilot',
                      nr: '9999',
                      member: 'pilot-ref',
                      id: 'pilot-id'
                    },
                    instructor: {
                      firstname: 'Hans',
                      lastname: 'Superfluglehrer',
                      nr: null,
                      member: 'instructor-ref',
                      id: 'instructor-id'
                    },
                    nature: 'vp',
                    departureAerodrome: {
                      aerodrome: 'dep-ad-ref',
                      id: 'dep-ad-id',
                      identification: 'LSZT',
                      name: 'Lommis',
                      timezone: 'Europe/Zurich'
                    },
                    destinationAerodrome: {
                      aerodrome: 'dest-ad-ref',
                      id: 'dest-ad-id',
                      identification: 'LSPV',
                      name: 'Wangen-Lachen',
                      timezone: 'Europe/Zurich'
                    },
                    blockOffTime: new Date('2018-12-13T09:00:00.000Z'),
                    takeOffTime: new Date('2018-12-13T09:05:00.000Z'),
                    landingTime: new Date('2018-12-13T09:35:00.000Z'),
                    blockOnTime: new Date('2018-12-13T09:40:00.000Z'),
                    counters: {
                      flightTimeCounter: counter(45780, 45830),
                      engineTimeCounter: counter(50145, 50612),
                      flightHours: counter(58658, 58708),
                      engineHours: counter(65865, 66332),
                      flights: counter(464, 465),
                      landings: counter(3846, 3849)
                    },
                    landings: 3,
                    fuelUplift: 57.89,
                    fuelUnit: 'litre',
                    fuelType: 'avgas_homebase',
                    oilUplift: 2.45,
                    oilUnit: 'litre'
                  }
                )
              )

              const flightDoc = {
                id: 'new-flight-id'
              }

              const expectedEntry = {
                description: 'Schraube am Bugfahrwerkt locker',
                initial_status: 'not_airworthy',
                current_status: 'not_airworthy',
                closed: false,
                flight: 'new-flight-id'
              }

              expect(generator.next(flightDoc).value).toEqual(
                call(callFunction, 'addTechlogEntry', {
                  organizationId: 'my-org',
                  aircraftId: 'o7flC7jw8jmkOfWo8oyA',
                  entry: expectedEntry
                })
              )

              expect(generator.next().value).toEqual(
                put(fetchAircrafts('my-org'))
              )
              expect(generator.next().value).toEqual(call(sagas.fetchTechlog))
              expect(generator.next().value).toEqual(
                put(actions.changeFlightsPage(0))
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
                select(sagas.aircraftSettingsSelector, aircraftId)
              )

              const aircraftSettings = {
                engineHoursCounterEnabled: true
              }

              expect(generator.next(aircraftSettings).value).toEqual(
                call(
                  validateSync,
                  data,
                  organizationId,
                  aircraftId,
                  aircraftSettings
                )
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

          describe('initCreateFlightDialog', () => {
            const orgId = 'my_org'
            const aircraftId = 'o7flC7jw8jmkOfWo8oyA'

            const action = actions.initCreateFlightDialog(orgId, aircraftId)

            const today = moment().format('YYYY-MM-DD')

            const currentMember = {
              id: 'memberid',
              lastname: 'Müller',
              firstname: 'Max'
            }
            const lastFlight = {
              counters: {
                flights: counter(122, 123),
                flightHours: counter(10145, 10250),
                engineHours: counter(10378, 10502),
                landings: counter(2356, 2357),
                flightTimeCounter: counter(9145, 9250),
                engineTimeCounter: counter(9378, 9502)
              }
            }
            const destinationAerodrome = {
              id: 'aerodromeid',
              name: 'Lommis',
              identification: 'LSZT',
              timezone: 'Europe/Zurich'
            }

            it('should set the default values for the new flight', () => {
              const aircraftSettings = {
                engineHoursCounterEnabled: true
              }

              const expectedDefaultValues = {
                date: today,
                pilot: {
                  value: 'memberid',
                  label: 'Müller Max'
                },
                departureAerodrome: {
                  value: 'aerodromeid',
                  label: 'LSZT (Lommis)',
                  timezone: 'Europe/Zurich'
                },
                counters: {
                  flights: { start: 123 },
                  flightHours: { start: 10250 },
                  engineHours: { start: 10502 },
                  landings: { start: 2357 },
                  flightTimeCounter: { start: 9250 },
                  engineTimeCounter: { start: 9502 }
                },
                blockOffTime: null,
                takeOffTime: null,
                landingTime: null,
                blockOnTime: null
              }

              return expectSaga(sagas.initCreateFlightDialog, action)
                .provide([
                  [call(sagas.getCurrentMember), currentMember],
                  [call(getLastFlight, orgId, aircraftId), lastFlight],
                  [
                    call(sagas.getDestinationAerodrome, lastFlight),
                    destinationAerodrome
                  ],
                  [
                    select(sagas.aircraftSettingsSelector, aircraftId),
                    aircraftSettings
                  ]
                ])
                .put(
                  actions.setInitialCreateFlightDialogData(
                    expectedDefaultValues
                  )
                )
                .run()
            })

            it('should not set engine hours start counter if not enabled', () => {
              const aircraftSettings = {
                engineHoursCounterEnabled: false
              }

              const expectedDefaultValues = {
                date: today,
                pilot: {
                  value: 'memberid',
                  label: 'Müller Max'
                },
                departureAerodrome: {
                  value: 'aerodromeid',
                  label: 'LSZT (Lommis)',
                  timezone: 'Europe/Zurich'
                },
                counters: {
                  flights: { start: 123 },
                  flightHours: { start: 10250 },
                  landings: { start: 2357 },
                  flightTimeCounter: { start: 9250 }
                },
                blockOffTime: null,
                takeOffTime: null,
                landingTime: null,
                blockOnTime: null
              }

              return expectSaga(sagas.initCreateFlightDialog, action)
                .provide([
                  [call(sagas.getCurrentMember), currentMember],
                  [call(getLastFlight, orgId, aircraftId), lastFlight],
                  [
                    call(sagas.getDestinationAerodrome, lastFlight),
                    destinationAerodrome
                  ],
                  [
                    select(sagas.aircraftSettingsSelector, aircraftId),
                    aircraftSettings
                  ]
                ])
                .put(
                  actions.setInitialCreateFlightDialogData(
                    expectedDefaultValues
                  )
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
                put(actions.fetchFlights())
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

          describe('createAerodrome', () => {
            const orgId = 'my_org'
            const fieldName = 'destination'
            const data = {
              identification: 'LSXX',
              name: 'Hagenbuch',
              timezone: 'Europe/Zurich'
            }

            const action = actions.createAerodrome(orgId, fieldName, data)

            it('should create the aerodrome in the organization', () => {
              const expectedDataToStore = {
                identification: data.identification,
                name: data.name,
                timezone: data.timezone.value,
                deleted: false
              }

              const createdAerodromeDoc = {
                id: 'newAerodromeId'
              }

              return expectSaga(sagas.createAerodrome, action)
                .provide([
                  [
                    call(
                      addDoc,
                      ['organizations', orgId, 'aerodromes'],
                      expectedDataToStore
                    ),
                    createdAerodromeDoc
                  ]
                ])
                .put(actions.setCreateAerodromeDialogSubmitting())
                .put(
                  actions.updateCreateFlightDialogData({
                    [fieldName]: {
                      value: 'newAerodromeId',
                      label: 'LSXX (Hagenbuch)'
                    }
                  })
                )
                .put(fetchAerodromes(orgId))
                .put(actions.createAeorodromeSuccess())
                .run()
            })
          })

          describe('initTechlog', () => {
            it('should init the techlog list state', () => {
              const action = actions.initTechlog(
                'my_org',
                'o7flC7jw8jmkOfWo8oyA',
                true
              )
              return expectSaga(sagas.initTechlog, action)
                .provide([[call(sagas.fetchTechlog)]])
                .put(
                  actions.setTechlogParams(
                    'my_org',
                    'o7flC7jw8jmkOfWo8oyA',
                    true
                  )
                )
                .call(sagas.fetchTechlog)
                .run()
            })
          })

          describe('changeTechlogPage', () => {
            it('should change the page of the techlog list', () => {
              const action = actions.changeTechlogPage(2)
              return expectSaga(sagas.changeTechlogPage, action)
                .provide([[call(sagas.fetchTechlog)]])
                .put(actions.setTechlogPage(2))
                .call(sagas.fetchTechlog)
                .run()
            })
          })

          describe('createTechlogEntry', () => {
            it('should create a techlog entry', () => {
              const data = {
                status: { value: 'not_airworthy' },
                description: 'Schraube am Bugfahrwerk locker'
              }
              const expectedDataToStore = {
                description: 'Schraube am Bugfahrwerk locker',
                initial_status: 'not_airworthy',
                current_status: 'not_airworthy',
                closed: false,
                flight: null
              }
              const action = actions.createTechlogEntry(
                'my_org',
                'o7flC7jw8jmkOfWo8oyA',
                data
              )
              return expectSaga(sagas.createTechlogEntry, action)
                .provide([
                  [call(sagas.fetchTechlog)],
                  [
                    call(callFunction, 'addTechlogEntry', {
                      organizationId: 'my_org',
                      aircraftId: 'o7flC7jw8jmkOfWo8oyA',
                      entry: expectedDataToStore
                    })
                  ]
                ])
                .put(actions.setCreateTechlogEntryDialogSubmitting())
                .call(callFunction, 'addTechlogEntry', {
                  organizationId: 'my_org',
                  aircraftId: 'o7flC7jw8jmkOfWo8oyA',
                  entry: expectedDataToStore
                })
                .put(fetchAircrafts('my_org'))
                .call(sagas.fetchTechlog)
                .put(actions.createTechlogEntrySuccess())
                .run()
            })
          })

          describe('createTechlogEntryAction', () => {
            it('should create a techlog entry action', () => {
              const data = {
                status: { value: 'not_airworthy' },
                description: 'Schraube bestellt',
                signature: 'XYZ-123'
              }
              const expectedDataToStore = {
                description: 'Schraube bestellt',
                status: 'not_airworthy',
                signature: 'XYZ-123'
              }
              const action = actions.createTechlogEntryAction(
                'my_org',
                'o7flC7jw8jmkOfWo8oyA',
                'asdf245asfjkl',
                data
              )
              return expectSaga(sagas.createTechlogEntryAction, action)
                .provide([
                  [call(sagas.fetchTechlog)],
                  [
                    call(callFunction, 'addTechlogEntryAction', {
                      organizationId: 'my_org',
                      aircraftId: 'o7flC7jw8jmkOfWo8oyA',
                      techlogEntryId: 'asdf245asfjkl',
                      action: expectedDataToStore,
                      techlogEntryClosed: false
                    })
                  ]
                ])
                .put(actions.setCreateTechlogEntryActionDialogSubmitting())
                .call(callFunction, 'addTechlogEntryAction', {
                  organizationId: 'my_org',
                  aircraftId: 'o7flC7jw8jmkOfWo8oyA',
                  techlogEntryId: 'asdf245asfjkl',
                  action: expectedDataToStore,
                  techlogEntryClosed: false
                })
                .put(fetchAircrafts('my_org'))
                .call(sagas.fetchTechlog)
                .put(actions.createTechlogEntryActionSuccess())
                .run()
            })
          })

          describe('default', () => {
            it('should fork all sagas', () => {
              const generator = sagas.default()

              expect(generator.next().value).toEqual(
                all([
                  takeEvery(actions.INIT_FLIGHTS_LIST, sagas.initFlightsList),
                  takeEvery(
                    actions.CHANGE_FLIGHTS_PAGE,
                    sagas.changeFlightsPage
                  ),
                  takeEvery(actions.FETCH_FLIGHTS, sagas.fetchFlights),
                  takeEvery(actions.CREATE_FLIGHT, sagas.createFlight),
                  takeEvery(
                    actions.INIT_CREATE_FLIGHT_DIALOG,
                    sagas.initCreateFlightDialog
                  ),
                  takeEvery(actions.DELETE_FLIGHT, sagas.deleteFlight),
                  takeEvery(actions.CREATE_AERODROME, sagas.createAerodrome),
                  takeEvery(actions.INIT_TECHLOG, sagas.initTechlog),
                  takeEvery(
                    actions.CHANGE_TECHLOG_PAGE,
                    sagas.changeTechlogPage
                  ),
                  takeEvery(
                    actions.CREATE_TECHLOG_ENTRY,
                    sagas.createTechlogEntry
                  ),
                  takeEvery(
                    actions.CREATE_TECHLOG_ENTRY_ACTION,
                    sagas.createTechlogEntryAction
                  )
                ])
              )
            })
          })
        })
      })
    })
  })
})
