import { put, takeLatest, all, call } from 'redux-saga/effects'
import { getFirebase } from '../../../util/firebase'
import * as actions from './actions'
import { error } from '../../../util/log'

export function* register(action) {
  const { firstname, lastname, email, password } = action.payload.data
  try {
    yield put(actions.setSubmitted())
    const firebase = yield call(getFirebase)
    const credentials = { email, password }
    const profile = { firstname, lastname, email }
    yield call(firebase.createUser, credentials, profile)
    yield put(actions.registrationSuccess())
  } catch (e) {
    error('Registration failed', e)
    yield put(actions.registrationFailure())
  }
}

export default function* sagas() {
  yield all([takeLatest(actions.REGISTER, register)])
}
