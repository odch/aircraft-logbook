import { takeEvery, all, call, put } from 'redux-saga/effects'
import * as actions from './actions'
import { fetchAircrafts } from '../../../../../module'
import { fetchChecks } from '../../../module'
import { error } from '../../../../../../../util/log'
import {
  addArrayItem,
  removeArrayItem,
  updateDoc
} from '../../../../../../../util/firestoreUtils'
import { callFunction } from '../../../../../../../util/firebase'

export function* createCheck({
  payload: { organizationId, aircraftId, data }
}) {
  try {
    yield put(actions.setCreateCheckDialogSubmitting())
    const check = {
      ...data
    }
    if (check.dateLimit) {
      check.dateLimit = check.dateLimit.getTime()
    }
    if (check.counterReference) {
      check.counterReference = check.counterReference.value
    }
    yield call(callFunction, 'addCheck', {
      organizationId,
      aircraftId,
      check
    })
    yield put(fetchChecks(organizationId, aircraftId))
    yield put(actions.createCheckSuccess())
  } catch (e) {
    error(`Failed to add check ${data.description}`, e)
    yield put(actions.createCheckFailure())
  }
}

export function* deleteCheck({
  payload: { organizationId, aircraftId, checkId }
}) {
  yield put(actions.setDeleteCheckDialogSubmitting())
  yield call(callFunction, 'deleteCheck', {
    organizationId,
    aircraftId,
    checkId
  })
  yield put(fetchChecks(organizationId, aircraftId))
  yield put(actions.closeDeleteCheckDialog())
}

export function* createFuelType({
  payload: { organizationId, aircraftId, data }
}) {
  try {
    yield put(actions.setCreateFuelTypeDialogSubmitting())
    yield call(
      addArrayItem,
      ['organizations', organizationId, 'aircrafts', aircraftId],
      'settings.fuelTypes',
      data
    )
    yield put(fetchAircrafts(organizationId))
    yield put(actions.createFuelTypeSuccess())
  } catch (e) {
    error(`Failed to add fuel type ${data.name}`, e)
    yield put(actions.createFuelTypeFailure())
  }
}

export function* deleteFuelType({
  payload: { organizationId, aircraftId, fuelType }
}) {
  yield put(actions.setDeleteFuelTypeDialogSubmitting())

  yield call(
    removeArrayItem,
    ['organizations', organizationId, 'aircrafts', aircraftId],
    'settings.fuelTypes',
    fuelType
  )

  yield put(fetchAircrafts(organizationId))
  yield put(actions.closeDeleteFuelTypeDialog())
}

export function* updateSetting({
  payload: { organizationId, aircraftId, name, value }
}) {
  yield put(actions.setSettingSubmitting(name, true))

  yield call(
    updateDoc,
    ['organizations', organizationId, 'aircrafts', aircraftId],
    { [`settings.${name}`]: value }
  )

  yield put(fetchAircrafts(organizationId))
  yield put(actions.setSettingSubmitting(name, false))
}

export function* deleteAircraft({ payload: { organizationId, aircraftId } }) {
  yield put(actions.setDeleteAircraftDialogSubmitting())
  yield call(
    updateDoc,
    ['organizations', organizationId, 'aircrafts', aircraftId],
    { deleted: true }
  )
  yield put(fetchAircrafts(organizationId))
  yield put(actions.closeDeleteAircraftDialog())
}

export default function* sagas() {
  yield all([
    takeEvery(actions.CREATE_CHECK, createCheck),
    takeEvery(actions.DELETE_CHECK, deleteCheck),
    takeEvery(actions.CREATE_FUEL_TYPE, createFuelType),
    takeEvery(actions.DELETE_FUEL_TYPE, deleteFuelType),
    takeEvery(actions.UPDATE_SETTING, updateSetting),
    takeEvery(actions.DELETE_AIRCRAFT, deleteAircraft)
  ])
}
