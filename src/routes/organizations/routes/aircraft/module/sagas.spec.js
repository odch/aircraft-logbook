import { all, takeEvery, call, put, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import moment from 'moment'
import { callFunction, getFirestore } from '../../../../../util/firebase'
import {
  addDoc,
  runTransaction,
  updateDoc,
  serverTimestamp
} from '../../../../../util/firestoreUtils'
import * as actions from './actions'
import * as sagas from './sagas'
import getLastFlight from './util/getLastFlight'
import { validateSync, validateAsync } from './util/validateFlight'
import { fetchAerodromes } from '../../../module'
import { fetchAircrafts } from '../../../module/actions'
import {
  getCurrentMember,
  getCurrentMemberObject,
  getMemberObject
} from '../../../util/members'

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
                rowsPerPage: 10,
                showDeleted: false
              }

              expect(generator.next(aircraftFlightsView).value).toEqual(
                call(
                  sagas.getStartFlightDocument,
                  'my_org',
                  'o7flC7jw8jmkOfWo8oyA',
                  0,
                  false
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
                remarks: 'bemerkung zeile 1\nzeile2',
                personsOnBoard: 1,
                preflightCheck: true,
                troublesObservations: 'troubles',
                techlogEntryStatus: { value: 'defect_aog' },
                techlogEntryDescription: ' Schraube am Bugfahrwerkt locker\n  ',
                techlogEntryAttachments: [
                  {
                    name: 'image.jpeg',
                    contentType: 'image/jpeg',
                    file: {}
                  },
                  {
                    name: 'foobar.pdf',
                    contentType: 'application/pdf',
                    file: {}
                  }
                ]
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
                engineHoursCounterEnabled: true,
                techlogEnabled: true
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

              const owner = {
                firstname: 'Stefan',
                lastname: 'Müller',
                nr: '8534',
                member: 'owner-ref',
                id: 'owner-id'
              }
              const pilot = {
                firstname: 'Max',
                lastname: 'Superpilot',
                nr: '9999',
                member: 'pilot-ref',
                id: 'pilot-id'
              }
              const instructor = {
                firstname: 'Hans',
                lastname: 'Superfluglehrer',
                nr: null,
                member: 'instructor-ref',
                id: 'instructor-id'
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
              const timestampFieldValue = {}

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
                call(getCurrentMemberObject, organizationId)
              )
              expect(generator.next(owner).value).toEqual(
                call(getMemberObject, organizationId, data.pilot.value)
              )
              expect(generator.next(pilot).value).toEqual(
                call(getMemberObject, organizationId, data.instructor.value)
              )
              expect(generator.next(instructor).value).toEqual(
                call(serverTimestamp)
              )
              expect(generator.next(timestampFieldValue).value).toEqual(
                call(sagas.addNewFlightDoc, organizationId, aircraftId)
              )

              const newFlightDoc = {
                ref: {},
                id: 'new-flight-id',
                deleted: true
              }

              const dataToStore = {
                deleted: false,
                version: 1,
                owner,
                createTimestamp: {},
                pilot,
                instructor,
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
                oilUnit: 'litre',
                remarks: 'bemerkung zeile 1\nzeile2',
                personsOnBoard: 1,
                preflightCheck: true,
                troublesObservations: 'troubles',
                techlogEntryStatus: 'defect_aog',
                techlogEntryDescription: 'Schraube am Bugfahrwerkt locker'
              }

              expect(generator.next(newFlightDoc).value).toEqual(
                call(
                  runTransaction,
                  sagas.setFlightData,
                  null,
                  newFlightDoc,
                  dataToStore,
                  dataToStore.owner,
                  {}
                )
              )

              expect(generator.next().value).toEqual(
                call(sagas.getAttachments, data.techlogEntryAttachments)
              )

              const attachments = [
                {
                  name: 'image.jpeg',
                  base64: 'att1-base64',
                  contentType: 'image/jpeg'
                },
                {
                  name: 'foobar.pdf',
                  base64: 'att2-base64',
                  contentType: 'application/pdf'
                }
              ]

              const expectedEntry = {
                description: 'Schraube am Bugfahrwerkt locker',
                initialStatus: 'defect_aog',
                currentStatus: 'defect_aog',
                closed: false,
                flight: 'new-flight-id',
                attachments
              }

              expect(generator.next(attachments).value).toEqual(
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

            it('should save a new flight with troubles with techlog disabled', () => {
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
                  flightHours: { start: 58658 },
                  flights: { start: 464 },
                  landings: { start: 3846 }
                },
                landings: 3,
                fuelUplift: 5789,
                fuelType: { value: 'avgas_homebase' },
                oilUplift: 245,
                remarks: 'bemerkung zeile 1\nzeile2',
                personsOnBoard: 1,
                preflightCheck: true,
                troublesObservations: 'troubles',
                techlogEntryDescription: ' Schraube am Bugfahrwerkt locker\n  '
              }

              const action = actions.createFlight(
                organizationId,
                aircraftId,
                data
              )

              const owner = {
                firstname: 'Stefan',
                lastname: 'Müller',
                nr: '8534',
                member: 'owner-ref',
                id: 'owner-id'
              }

              const aircraftSettings = {
                engineHoursCounterEnabled: false,
                techlogEnabled: false
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

              const timestampFieldValue = {}

              const pilot = {
                firstname: 'Max',
                lastname: 'Superpilot',
                nr: '9999',
                member: 'pilot-ref',
                id: 'pilot-id'
              }
              const instructor = {
                firstname: 'Hans',
                lastname: 'Superfluglehrer',
                nr: null,
                member: 'instructor-ref',
                id: 'instructor-id'
              }

              const newFlightDoc = {
                ref: {},
                id: 'new-flight-id',
                deleted: true
              }

              const dataToStore = {
                deleted: false,
                version: 1,
                owner,
                createTimestamp: timestampFieldValue,
                pilot,
                instructor,
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
                  flightHours: counter(58658, 58708),
                  flights: counter(464, 465),
                  landings: counter(3846, 3849)
                },
                landings: 3,
                fuelUplift: 57.89,
                fuelUnit: 'litre',
                fuelType: 'avgas_homebase',
                oilUplift: 2.45,
                oilUnit: 'litre',
                remarks: 'bemerkung zeile 1\nzeile2',
                personsOnBoard: 1,
                preflightCheck: true,
                troublesObservations: 'troubles',
                techlogEntryDescription: 'Schraube am Bugfahrwerkt locker'
              }

              return expectSaga(sagas.createFlight, action)
                .provide([
                  [
                    select(sagas.aircraftSettingsSelector, aircraftId),
                    aircraftSettings
                  ],
                  [
                    call(
                      sagas.getAerodrome,
                      organizationId,
                      data.departureAerodrome.value
                    ),
                    departureAerodrome
                  ],
                  [
                    call(
                      sagas.getAerodrome,
                      organizationId,
                      data.destinationAerodrome.value
                    ),
                    destinationAerodrome
                  ],
                  [
                    call(
                      validateAsync,
                      dataWithMergedDateAndTime,
                      organizationId,
                      aircraftId
                    ),
                    {}
                  ],
                  [call(getCurrentMemberObject, organizationId), owner],
                  [
                    call(getMemberObject, organizationId, data.pilot.value),
                    pilot
                  ],
                  [
                    call(
                      getMemberObject,
                      organizationId,
                      data.instructor.value
                    ),
                    instructor
                  ],
                  [call(serverTimestamp), timestampFieldValue],
                  [
                    call(sagas.addNewFlightDoc, organizationId, aircraftId),
                    newFlightDoc
                  ],
                  [
                    call(
                      runTransaction,
                      sagas.setFlightData,
                      null,
                      newFlightDoc,
                      dataToStore,
                      dataToStore.owner,
                      timestampFieldValue
                    )
                  ]
                ])
                .put(actions.setCreateFlightDialogSubmitting())
                .put(actions.changeFlightsPage(0))
                .put(actions.createFlightSuccess())
                .run()
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

          describe('setFlightData', () => {
            const oldFlightData = {
              deleted: false,
              version: 2,
              pilot: {
                firstname: 'Kurt',
                lastname: 'Meier'
              },
              vp: 'nature'
            }
            const oldFlightDoc = {
              id: 'old-flight-id',
              ref: { id: 'old-flight-id' },
              data: () => oldFlightData,
              get: field => oldFlightData[field]
            }
            const newFlightDoc = {
              id: 'new-flight-id',
              ref: { id: 'new-flight-id' }
            }
            const dataToStore = {
              deleted: false,
              pilot: {
                firstname: 'Max',
                lastname: 'Superpilot'
              },
              vp: 'nature'
            }
            const currentMember = {
              firstname: 'Stefan',
              lastname: 'Gubler'
            }
            const timestampFieldValue = {}

            it('should set the new flight data', () => {
              const fn = sagas.setFlightData(null, newFlightDoc, dataToStore)

              const tx = {
                update: jest.fn()
              }

              fn(tx)

              expect(tx.update.mock.calls).toEqual([
                [
                  { id: 'new-flight-id' },
                  {
                    deleted: false,
                    pilot: {
                      firstname: 'Max',
                      lastname: 'Superpilot'
                    },
                    vp: 'nature'
                  }
                ]
              ])
            })

            it('should set the new flight data and hide old flight if update', () => {
              const fn = sagas.setFlightData(
                oldFlightDoc,
                newFlightDoc,
                dataToStore,
                currentMember,
                timestampFieldValue
              )

              const tx = {
                update: jest.fn()
              }

              fn(tx)

              expect(tx.update.mock.calls).toEqual([
                [
                  { id: 'old-flight-id' },
                  {
                    replacedWith: 'new-flight-id',
                    deleted: true,
                    deletedBy: currentMember,
                    deleteTimestamp: timestampFieldValue
                  }
                ],
                [
                  { id: 'new-flight-id' },
                  {
                    replaces: 'old-flight-id',
                    deleted: false,
                    version: 3,
                    pilot: {
                      firstname: 'Max',
                      lastname: 'Superpilot'
                    },
                    vp: 'nature'
                  }
                ]
              ])
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
                  [call(getCurrentMember), currentMember],
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
                  [call(getCurrentMember), currentMember],
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

          describe('openAndInitEditFlightDialog', () => {
            const orgId = 'my_org'
            const aircraftId = 'o7flC7jw8jmkOfWo8oyA'
            const flightId = 'xGSRg42wA'

            const action = actions.openEditFlightDialog(
              orgId,
              aircraftId,
              flightId
            )

            const flight = {
              id: flightId,
              data: () => ({
                nature: 'vs',
                pilot: {
                  id: 'pilotid',
                  lastname: 'Müller',
                  firstname: 'Max'
                },
                instructor: {
                  id: 'instructorid',
                  lastname: 'Keller',
                  firstname: 'Heinz'
                },
                blockOffTime: {
                  toDate: () => new Date('2018-12-13T09:00:00.000Z')
                },
                takeOffTime: {
                  toDate: () => new Date('2018-12-13T09:05:00.000Z')
                },
                landingTime: {
                  toDate: () => new Date('2018-12-13T09:35:00.000Z')
                },
                blockOnTime: {
                  toDate: () => new Date('2018-12-13T09:40:00.000Z')
                },
                departureAerodrome: {
                  id: 'depaerodromeid',
                  name: 'Wangen-Lachen',
                  identification: 'LSPV',
                  timezone: 'Europe/Zurich'
                },
                destinationAerodrome: {
                  id: 'destaerodromeid',
                  name: 'Lommis',
                  identification: 'LSZT',
                  timezone: 'Europe/Zurich'
                },
                landings: 1,
                personsOnBoard: 2,
                fuelUplift: 45.5,
                fuelType: 'jet_a1_homebase',
                oilUplift: 0.5,
                counters: {},
                preflightCheck: true,
                remarks: 'my test remark',
                troublesObservations: 'troubles',
                techlogEntryDescription: 'Loose screw',
                techlogEntryStatus: 'defect_aog'
              })
            }

            const aircraftSettings = {
              engineHoursCounterEnabled: true,
              fuelTypes: [
                {
                  name: 'jet_a1_homebase',
                  description: 'Jet A1 (Homebase)'
                }
              ]
            }
            const expectedFlightValues = {
              id: flightId,
              date: '2018-12-13',
              pilot: {
                value: 'pilotid',
                label: 'Müller Max'
              },
              instructor: {
                value: 'instructorid',
                label: 'Keller Heinz'
              },
              nature: 'vs',
              departureAerodrome: {
                value: 'depaerodromeid',
                label: 'LSPV (Wangen-Lachen)',
                timezone: 'Europe/Zurich'
              },
              destinationAerodrome: {
                value: 'destaerodromeid',
                label: 'LSZT (Lommis)',
                timezone: 'Europe/Zurich'
              },
              blockOffTime: '2018-12-13 10:00',
              takeOffTime: '2018-12-13 10:05',
              landingTime: '2018-12-13 10:35',
              blockOnTime: '2018-12-13 10:40',
              landings: 1,
              personsOnBoard: 2,
              fuelUplift: 4550,
              fuelType: {
                value: 'jet_a1_homebase',
                label: 'Jet A1 (Homebase)'
              },
              oilUplift: 50,
              remarks: 'my test remark',
              counters: {},
              preflightCheck: true,
              troublesObservations: 'troubles',
              techlogEntryDescription: 'Loose screw',
              techlogEntryStatus: 'defect_aog'
            }

            it('should open the flight edit dialog with the flight values', () => {
              return expectSaga(sagas.openAndInitEditFlightDialog, action)
                .provide([
                  [call(sagas.getFlight, orgId, aircraftId, flightId), flight],
                  [
                    select(sagas.aircraftSettingsSelector, aircraftId),
                    aircraftSettings
                  ]
                ])
                .put(actions.openCreateFlightDialog())
                .put(
                  actions.setInitialCreateFlightDialogData(
                    expectedFlightValues,
                    [
                      'date',
                      'pilot',
                      'instructor',
                      'nature',
                      'departureAerodrome',
                      'destinationAerodrome',
                      'counters.flightTimeCounter.start',
                      'counters.flightTimeCounter.end',
                      'counters.engineTimeCounter.start',
                      'counters.engineTimeCounter.end',
                      'blockOffTime',
                      'takeOffTime',
                      'landingTime',
                      'blockOnTime',
                      'landings',
                      'personsOnBoard',
                      'fuelUplift',
                      'fuelType',
                      'oilUplift',
                      'remarks'
                    ],
                    [
                      'pilot',
                      'instructor',
                      'nature',
                      'personsOnBoard',
                      'fuelUplift',
                      'fuelType',
                      'oilUplift',
                      'remarks'
                    ]
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
                call(getCurrentMemberObject, 'my_org')
              )

              const currentMember = {
                id: 'member-id',
                member: 'member-ref',
                lastname: 'Müller',
                firstname: 'Max',
                nr: '9999'
              }

              expect(generator.next(currentMember).value).toEqual(
                call(serverTimestamp)
              )

              const timestampFieldValue = {}

              expect(generator.next(timestampFieldValue).value).toEqual(
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
                    deleted: true,
                    deleteTimestamp: timestampFieldValue,
                    deletedBy: {
                      firstname: 'Max',
                      id: 'member-id',
                      lastname: 'Müller',
                      member: 'member-ref',
                      nr: '9999'
                    }
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

          describe('createAerodrome', () => {
            const orgId = 'my_org'
            const fieldName = 'destination'
            const data = {
              identification: 'LSXX',
              name: 'Hagenbuch',
              timezone: {
                value: 'Europe/Zurich'
              }
            }

            const action = actions.createAerodrome(orgId, fieldName, data)

            it('should create the aerodrome in the organization', () => {
              const expectedDataToStore = {
                identification: 'LSXX',
                name: 'Hagenbuch',
                timezone: 'Europe/Zurich',
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
                      label: 'LSXX (Hagenbuch)',
                      timezone: 'Europe/Zurich'
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
                status: { value: 'defect_aog' },
                description: 'Schraube am Bugfahrwerk locker',
                attachments: [
                  {
                    name: 'image.jpeg',
                    contentType: 'image/jpeg',
                    file: {}
                  },
                  {
                    name: 'foobar.pdf',
                    contentType: 'application/pdf',
                    file: {}
                  }
                ]
              }
              const expectedDataToStore = {
                description: 'Schraube am Bugfahrwerk locker',
                initialStatus: 'defect_aog',
                currentStatus: 'defect_aog',
                closed: false,
                flight: null,
                attachments: [
                  {
                    name: 'image.jpeg',
                    base64: 'att1-base64',
                    contentType: 'image/jpeg'
                  },
                  {
                    name: 'foobar.pdf',
                    base64: 'att2-base64',
                    contentType: 'application/pdf'
                  }
                ]
              }
              const action = actions.createTechlogEntry(
                'my_org',
                'o7flC7jw8jmkOfWo8oyA',
                data
              )
              return expectSaga(sagas.createTechlogEntry, action)
                .provide([
                  [
                    call(sagas.getAttachments, data.attachments),
                    [
                      {
                        name: 'image.jpeg',
                        base64: 'att1-base64',
                        contentType: 'image/jpeg'
                      },
                      {
                        name: 'foobar.pdf',
                        base64: 'att2-base64',
                        contentType: 'application/pdf'
                      }
                    ]
                  ],
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
                .call(sagas.getAttachments, data.attachments)
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
                status: { value: 'defect_aog' },
                description: 'Schraube bestellt',
                signature: 'XYZ-123',
                attachments: [
                  {
                    name: 'image.jpeg',
                    contentType: 'image/jpeg',
                    file: {}
                  },
                  {
                    name: 'foobar.pdf',
                    contentType: 'application/pdf',
                    file: {}
                  }
                ]
              }
              const expectedDataToStore = {
                description: 'Schraube bestellt',
                status: 'defect_aog',
                signature: 'XYZ-123',
                attachments: [
                  {
                    name: 'image.jpeg',
                    base64: 'att1-base64',
                    contentType: 'image/jpeg'
                  },
                  {
                    name: 'foobar.pdf',
                    base64: 'att2-base64',
                    contentType: 'application/pdf'
                  }
                ]
              }
              const action = actions.createTechlogEntryAction(
                'my_org',
                'o7flC7jw8jmkOfWo8oyA',
                'asdf245asfjkl',
                data
              )
              return expectSaga(sagas.createTechlogEntryAction, action)
                .provide([
                  [
                    call(sagas.getAttachments, data.attachments),
                    [
                      {
                        name: 'image.jpeg',
                        base64: 'att1-base64',
                        contentType: 'image/jpeg'
                      },
                      {
                        name: 'foobar.pdf',
                        base64: 'att2-base64',
                        contentType: 'application/pdf'
                      }
                    ]
                  ],
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
                  takeEvery(
                    actions.OPEN_EDIT_FLIGHT_DIALOG,
                    sagas.openAndInitEditFlightDialog
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
                  ),
                  takeEvery(actions.FETCH_CHECKS, sagas.fetchChecks)
                ])
              )
            })
          })
        })
      })
    })
  })
})
