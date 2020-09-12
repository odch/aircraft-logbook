import { all, takeEvery, call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import {
  addArrayItem,
  removeArrayItem,
  updateDoc
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

              describe('deleteFuelType', () => {
                it('should remove a fuel type of the aircraft', () => {
                  const orgId = 'my_org'
                  const aircraftId = 'my_aircraft'
                  const fuelType = {
                    name: 'jet_a1',
                    description: 'Jet A1'
                  }

                  const action = actions.deleteFuelType(
                    orgId,
                    aircraftId,
                    fuelType
                  )

                  return expectSaga(sagas.deleteFuelType, action)
                    .provide([
                      [
                        call(
                          removeArrayItem,
                          ['organizations', orgId, 'aircrafts', aircraftId],
                          'settings.fuelTypes',
                          fuelType
                        )
                      ]
                    ])
                    .put(actions.setDeleteFuelTypeDialogSubmitting())
                    .put(fetchAircrafts(orgId))
                    .put(actions.closeDeleteFuelTypeDialog())
                    .run()
                })
              })

              describe('updateSetting', () => {
                it('should update techlogEnabled setting', () => {
                  const orgId = 'my_org'
                  const aircraftId = 'my_aircraft'

                  const action = actions.updateSetting(
                    orgId,
                    aircraftId,
                    'techlogEnabled',
                    true
                  )

                  return expectSaga(sagas.updateSetting, action)
                    .provide([
                      [
                        call(
                          updateDoc,
                          ['organizations', orgId, 'aircrafts', aircraftId],
                          { 'settings.techlogEnabled': true }
                        )
                      ]
                    ])
                    .put(actions.setSettingSubmitting('techlogEnabled', true))
                    .call(
                      updateDoc,
                      ['organizations', orgId, 'aircrafts', aircraftId],
                      { 'settings.techlogEnabled': true }
                    )
                    .put(fetchAircrafts(orgId))
                    .put(actions.setSettingSubmitting('techlogEnabled', false))
                    .run()
                })

                it('should update engineHoursCounterEnabled setting', () => {
                  const orgId = 'my_org'
                  const aircraftId = 'my_aircraft'

                  const action = actions.updateSetting(
                    orgId,
                    aircraftId,
                    'engineHoursCounterEnabled',
                    true
                  )

                  return expectSaga(sagas.updateSetting, action)
                    .provide([
                      [
                        call(
                          updateDoc,
                          ['organizations', orgId, 'aircrafts', aircraftId],
                          { 'settings.engineHoursCounterEnabled': true }
                        )
                      ]
                    ])
                    .put(
                      actions.setSettingSubmitting(
                        'engineHoursCounterEnabled',
                        true
                      )
                    )
                    .call(
                      updateDoc,
                      ['organizations', orgId, 'aircrafts', aircraftId],
                      { 'settings.engineHoursCounterEnabled': true }
                    )
                    .put(fetchAircrafts(orgId))
                    .put(
                      actions.setSettingSubmitting(
                        'engineHoursCounterEnabled',
                        false
                      )
                    )
                    .run()
                })

                it('should throw an error if unknown setting', () => {
                  const orgId = 'my_org'
                  const aircraftId = 'my_aircraft'

                  const action = actions.updateSetting(
                    orgId,
                    aircraftId,
                    'unknownSetting',
                    'foo'
                  )

                  const generator = sagas.updateSetting(action)

                  expect(() => generator.next()).toThrow(
                    'Unknown setting unknownSetting'
                  )
                })
              })

              describe('default', () => {
                it('should fork all sagas', () => {
                  const generator = sagas.default()

                  expect(generator.next().value).toEqual(
                    all([
                      takeEvery(actions.CREATE_CHECK, sagas.createCheck),
                      takeEvery(actions.DELETE_CHECK, deleteCheck),
                      takeEvery(actions.CREATE_FUEL_TYPE, sagas.createFuelType),
                      takeEvery(actions.DELETE_FUEL_TYPE, sagas.deleteFuelType),
                      takeEvery(actions.UPDATE_SETTING, sagas.updateSetting)
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
