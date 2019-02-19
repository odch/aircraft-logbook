import { call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { getFirestore } from '../../../../../../util/firebase'
import getLastFlight from './getLastFlight'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('util', () => {
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

              return expectSaga(getLastFlight, organizationId, aircraftId)
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

              return expectSaga(getLastFlight, organizationId, aircraftId)
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
        })
      })
    })
  })
})
