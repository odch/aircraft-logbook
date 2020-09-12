import { takeEvery, all, call, put } from 'redux-saga/effects'
import * as actions from './actions'
import { fetchAircrafts } from '../../../../../module'
import { error } from '../../../../../../../util/log'
import {
  addArrayItem,
  removeArrayItem,
  updateDoc
} from '../../../../../../../util/firestoreUtils'

export function* createCheck({
  payload: { organizationId, aircraftId, data }
}) {
  try {
    yield put(actions.setCreateCheckDialogSubmitting())

    const dataToPut = {
      ...data
    }

    if (dataToPut.counterReference) {
      dataToPut.counterReference = dataToPut.counterReference.value
    }

    yield call(
      addArrayItem,
      ['organizations', organizationId, 'aircrafts', aircraftId],
      'checks',
      dataToPut
    )

    yield put(fetchAircrafts(organizationId))
    yield put(actions.createCheckSuccess())
  } catch (e) {
    error(`Failed to add check ${data.description}`, e)
    yield put(actions.createCheckFailure())
  }
}

export function* deleteCheck({
  payload: { organizationId, aircraftId, check }
}) {
  yield put(actions.setDeleteCheckDialogSubmitting())

  yield call(
    removeArrayItem,
    ['organizations', organizationId, 'aircrafts', aircraftId],
    'checks',
    check
  )

  yield put(fetchAircrafts(organizationId))
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
  let data

  switch (name) {
    case 'techlogEnabled':
      data = { 'settings.techlogEnabled': value }
      break
    case 'engineHoursCounterEnabled':
      data = { 'settings.engineHoursCounterEnabled': value }
      break
    default:
      throw `Unknown setting ${name}`
  }

  yield put(actions.setSettingSubmitting(name, true))

  yield call(
    updateDoc,
    ['organizations', organizationId, 'aircrafts', aircraftId],
    data
  )

  yield put(fetchAircrafts(organizationId))
  yield put(actions.setSettingSubmitting(name, false))
}

export default function* sagas() {
  yield all([
    takeEvery(actions.CREATE_CHECK, createCheck),
    takeEvery(actions.DELETE_CHECK, deleteCheck),
    takeEvery(actions.CREATE_FUEL_TYPE, createFuelType),
    takeEvery(actions.DELETE_FUEL_TYPE, deleteFuelType),
    takeEvery(actions.UPDATE_SETTING, updateSetting)
  ])
}
