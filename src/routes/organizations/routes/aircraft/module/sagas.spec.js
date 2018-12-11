import { all, takeEvery, fork, call, put } from 'redux-saga/effects'
import { getFirestore } from '../../../../../util/firebase'
import { updateDoc } from '../../../../../util/firestoreUtils'
import * as actions from './actions'
import * as sagas from './sagas'

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
                      'member'
                    ]
                  },
                  {}
                )
              )

              expect(generator.next().done).toEqual(true)
            })
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
