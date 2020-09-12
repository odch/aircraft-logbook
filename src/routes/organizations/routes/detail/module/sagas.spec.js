import { all, takeEvery, call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { addDoc } from '../../../../../util/firestoreUtils'
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
                  [
                    call(
                      addDoc,
                      ['organizations', orgId, 'aircrafts'],
                      expectedData
                    )
                  ]
                ])
                .put(actions.setCreateAircraftDialogSubmitted())
                .call(
                  addDoc,
                  ['organizations', orgId, 'aircrafts'],
                  expectedData
                )
                .put(fetchAircrafts(orgId))
                .put(actions.createAircraftSuccess())
                .run()
            })
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
