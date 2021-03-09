import { all, takeEvery, call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { callFunction } from '../../../../../util/firebase'
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
              const organizationId = 'my_org'
              const aircraftData = {
                registration: 'HB-ABC'
              }

              const action = actions.createAircraft(
                organizationId,
                aircraftData
              )

              return expectSaga(sagas.createAircraft, action)
                .provide([
                  [
                    call(callFunction, 'addAircraft', {
                      organizationId,
                      aircraft: aircraftData
                    })
                  ]
                ])
                .put(fetchAircrafts(organizationId))
                .put(actions.createAircraftSuccess())
                .run()
            })

            it('should put setCreateAircraftDuplicate if the aircraft already exists', () => {
              const organizationId = 'my_org'
              const aircraftData = {
                registration: 'HB-ABC'
              }

              const action = actions.createAircraft(
                organizationId,
                aircraftData
              )

              return expectSaga(sagas.createAircraft, action)
                .provide([
                  [
                    call(callFunction, 'addAircraft', {
                      organizationId,
                      aircraft: aircraftData
                    }),
                    {
                      data: {
                        error: 'DUPLICATE'
                      }
                    }
                  ]
                ])
                .put(actions.setCreateAircraftDuplicate())
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
