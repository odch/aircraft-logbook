import { all, takeEvery, call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { addDoc } from '../../../../../util/firestoreUtils'
import { getFirestore } from '../../../../../util/firebase'
import * as actions from './actions'
import * as sagas from './sagas'
import { fetchAircrafts } from '../../../module'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('detail', () => {
        describe('sagas', () => {
          describe('createAircraft', () => {
            it('should add an aircraft to the organization', () => {
              const orgId = 'my_org'
              const aircraftData = {
                registration: 'HB-ABC'
              }
              const expectedData = {
                registration: 'HB-ABC',
                deleted: false
              }

              const action = actions.createAircraft(orgId, aircraftData)

              return expectSaga(sagas.createAircraft, action)
                .provide([
                  [call(sagas.aircraftExists, orgId, 'HB-ABC'), false],
                  [
                    call(
                      addDoc,
                      ['organizations', orgId, 'aircrafts'],
                      expectedData
                    )
                  ]
                ])
                .put(actions.setCreateAircraftDialogSubmitted())
                .call(sagas.aircraftExists, orgId, 'HB-ABC')
                .call(
                  addDoc,
                  ['organizations', orgId, 'aircrafts'],
                  expectedData
                )
                .put(fetchAircrafts(orgId))
                .put(actions.createAircraftSuccess())
                .run()
            })

            it('should abort the creation if the aircraft already exists', () => {
              const orgId = 'my_org'
              const aircraftData = {
                registration: 'HB-ABC'
              }
              const expectedData = {
                registration: 'HB-ABC',
                deleted: false
              }

              const action = actions.createAircraft(orgId, aircraftData)

              return expectSaga(sagas.createAircraft, action)
                .provide([
                  [call(sagas.aircraftExists, orgId, 'HB-ABC'), true],
                  [
                    call(
                      addDoc,
                      ['organizations', orgId, 'aircrafts'],
                      expectedData
                    )
                  ]
                ])
                .put(actions.setCreateAircraftDialogSubmitted())
                .put(actions.setCreateAircraftDuplicate())
                .not.call(
                  addDoc,
                  ['organizations', orgId, 'aircrafts'],
                  expectedData
                )
                .run()
            })
          })

          describe('aircraftExists', () => {
            it('should return true if the aircraft already exists', () =>
              testFn(1, true))

            it('should return false if the aircraft does not exist', () =>
              testFn(0, false))

            const testFn = (resultSize, expectedResult) => {
              const orgId = 'my_org'
              const registration = 'HB-ABC'

              const firestore = {
                get: () => {}
              }

              return expectSaga(sagas.aircraftExists, orgId, registration)
                .provide([
                  [call(getFirestore), firestore],
                  [
                    call(firestore.get, {
                      collection: 'organizations',
                      doc: orgId,
                      subcollections: [{ collection: 'aircrafts' }],
                      where: [
                        ['deleted', '==', false],
                        ['registration', '==', registration]
                      ],
                      limit: 1,
                      storeAs: 'existingAircraft'
                    }),
                    { size: resultSize }
                  ]
                ])
                .returns(expectedResult)
                .run()
            }
          })

          describe('default', () => {
            it('should fork all sagas', () => {
              const generator = sagas.default()

              expect(generator.next().value).toEqual(
                all([takeEvery(actions.CREATE_AIRCRAFT, sagas.createAircraft)])
              )
            })
          })
        })
      })
    })
  })
})
