import { all, takeEvery, fork, call, put } from 'redux-saga/effects'
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
                'o7flC7jw8jmkOfWo8oyA'
              )

              const generator = sagas.fetchFlights(fetchFlightsAction)

              expect(generator.next().value).toEqual(call(getFirestore))

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
                    limit: 5,
                    storeAs: 'flights-o7flC7jw8jmkOfWo8oyA',
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

          describe('createFlight', () => {
            const organizationId = 'my-org'
            const aircraftId = 'o7flC7jw8jmkOfWo8oyA'

            const data = {
              pilot: { value: 'pilot-id' },
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
                }
              }
            }

            const action = actions.createFlight(
              organizationId,
              aircraftId,
              data
            )

            const generator = sagas.createFlight(action)

            expect(generator.next().value).toEqual(call(sagas.getCurrentMember))

            const currentMember = {
              id: 'member-id'
            }
            const owner = { ref: 'owner-ref' }
            const pilot = { ref: 'pilot-ref' }
            const departureAerodrome = { ref: 'dep-ad-ref' }
            const destinationAerodrome = { ref: 'dest-ad-ref' }

            expect(generator.next(currentMember).value).toEqual(
              call(sagas.getMember, organizationId, currentMember.id)
            )
            expect(generator.next(owner).value).toEqual(
              call(sagas.getMember, organizationId, data.pilot.value)
            )
            expect(generator.next(pilot).value).toEqual(
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
                  departureAerodrome: 'dep-ad-ref',
                  destinationAerodrome: 'dest-ad-ref',
                  blockOffTime: new Date('2018-12-15T09:00:00.000Z'), // TODO: Fix: we want LT of departure AD
                  takeOffTime: new Date('2018-12-15T09:05:00.000Z'), // TODO: Fix: we want LT of departure AD
                  landingTime: new Date('2018-12-15T09:35:00.000Z'), // TODO: Fix: we want LT of destination AD
                  blockOnTime: new Date('2018-12-15T09:40:00.000Z'), // TODO: Fix: we want LT of destination AD
                  counters: {
                    flightHours: {
                      start: 45780,
                      end: 45830
                    }
                  }
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

          describe('deleteFlight', () => {
            const aircraftId = 'o7flC7jw8jmkOfWo8oyA'
            const flightId = 'flight-id'

            const action = actions.deleteFlight('my_org', aircraftId, flightId)

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
