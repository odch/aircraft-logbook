import { takeEvery, all, call, put } from 'redux-saga/effects'
import { error } from '../../../../../util/log'
import { callFunction } from '../../../../../util/firebase'
import { fetchAircrafts } from '../../../module'
import * as actions from './actions'

const ERROR_ACTIONS = {
  DUPLICATE: actions.setCreateAircraftDuplicate
}

export function* createAircraft({ payload: { organizationId, data } }) {
  try {
    const result = yield call(callFunction, 'addAircraft', {
      organizationId,
      aircraft: data
    })
    if (result && result.data && result.data.error) {
      const action =
        ERROR_ACTIONS[result.data.error] || actions.createAircraftFailure
      yield put(action())
    } else {
      yield put(fetchAircrafts(organizationId))
      yield put(actions.createAircraftSuccess())
    }
  } catch (e) {
    error(`Failed to create aircraft ${data.registration}`, e)
    yield put(actions.createAircraftFailure())
  }
}

export default function* sagas() {
  yield all([takeEvery(actions.CREATE_AIRCRAFT, createAircraft)])
}
