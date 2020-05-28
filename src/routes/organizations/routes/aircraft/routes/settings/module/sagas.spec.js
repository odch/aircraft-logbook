import { all, takeEvery, call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import {
  addArrayItem,
  removeArrayItem
} from '../../../../../../../util/firestoreUtils'
import * as actions from './actions'
import * as sagas from './sagas'
import { fetchAircrafts } from '../../../../../module'
import { deleteCheck } from './sagas'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('routes', () => {
          describe('settings', () => {
            describe('sagas', () => {
              describe('createCheck', () => {
                it('should add a check to the aircraft', () => {
                  const orgId = 'my_org'
                  const aircraftId = 'my_aircraft'
                  const check = {
                    description: 'Next Foobar Check',
                    dateLimit: new Date(2020, 6, 30)
                  }

                  const action = actions.createCheck(orgId, aircraftId, check)

                  return expectSaga(sagas.createCheck, action)
                    .provide([
                      [
                        call(
                          addArrayItem,
                          ['organizations', orgId, 'aircrafts', aircraftId],
                          'checks',
                          check
                        )
                      ]
                    ])
                    .put(actions.setCreateCheckDialogSubmitting())
                    .put(fetchAircrafts(orgId))
                    .put(actions.createCheckSuccess())
                    .run()
                })
              })

              describe('deleteCheck', () => {
                it('should remove a check of the aircraft', () => {
                  const orgId = 'my_org'
                  const aircraftId = 'my_aircraft'
                  const check = {
                    description: 'Next Foobar Check',
                    dateLimit: new Date(2020, 6, 30)
                  }

                  const action = actions.deleteCheck(orgId, aircraftId, check)

                  return expectSaga(sagas.deleteCheck, action)
                    .provide([
                      [
                        call(
                          removeArrayItem,
                          ['organizations', orgId, 'aircrafts', aircraftId],
                          'checks',
                          check
                        )
                      ]
                    ])
                    .put(actions.setDeleteCheckDialogSubmitting())
                    .put(fetchAircrafts(orgId))
                    .put(actions.closeDeleteCheckDialog())
                    .run()
                })
              })

              describe('createFuelType', () => {
                it('should add a fuel type to the aircraft', () => {
                  const orgId = 'my_org'
                  const aircraftId = 'my_aircraft'
                  const fuelType = {
                    name: 'jet_a1',
                    description: 'Jet A1'
                  }

                  const action = actions.createFuelType(
                    orgId,
                    aircraftId,
                    fuelType
                  )

                  return expectSaga(sagas.createFuelType, action)
                    .provide([
                      [
                        call(
                          addArrayItem,
                          ['organizations', orgId, 'aircrafts', aircraftId],
                          'settings.fuelTypes',
                          fuelType
                        )
                      ]
                    ])
                    .put(actions.setCreateFuelTypeDialogSubmitting())
                    .put(fetchAircrafts(orgId))
                    .put(actions.createFuelTypeSuccess())
                    .run()
                })
              })

              describe('default', () => {
                it('should fork all sagas', () => {
                  const generator = sagas.default()

                  expect(generator.next().value).toEqual(
                    all([
                      takeEvery(actions.CREATE_CHECK, sagas.createCheck),
                      takeEvery(actions.DELETE_CHECK, deleteCheck),
                      takeEvery(actions.CREATE_FUEL_TYPE, sagas.createFuelType)
                    ])
                  )
                })
              })
            })
          })
        })
      })
    })
  })
})
