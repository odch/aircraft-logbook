import { takeEvery, all, call, put } from 'redux-saga/effects'
import * as actions from './actions'
import { fetchAircrafts } from '../../../../../module'
import { error } from '../../../../../../../util/log'
import { addArrayItem } from '../../../../../../../util/firestoreUtils'

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

export default function* sagas() {
  yield all([takeEvery(actions.CREATE_FUEL_TYPE, createFuelType)])
}
