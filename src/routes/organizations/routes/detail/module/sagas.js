import { takeEvery, all, call, put } from 'redux-saga/effects'
import { error } from '../../../../../util/log'
import { addDoc } from '../../../../../util/firestoreUtils'
import { fetchAircrafts } from '../../../module'
import * as actions from './actions'

export function* createAircraft({ payload: { organizationId, data } }) {
  try {
    yield put(actions.setCreateAircraftDialogSubmitted())
    const dataToStore = {
      ...data,
      deleted: false
    }
    yield call(
      addDoc,
      ['organizations', organizationId, 'aircrafts'],
      dataToStore
    )
    yield put(fetchAircrafts(organizationId))
    yield put(actions.createAircraftSuccess())
  } catch (e) {
    error(`Failed to create aircraft ${data.registration}`, e)
    yield put(actions.createAircraftFailure())
  }
}

export default function* sagas() {
  yield all([takeEvery(actions.CREATE_AIRCRAFT, createAircraft)])
}
