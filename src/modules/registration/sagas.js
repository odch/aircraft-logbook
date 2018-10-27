import { fork, put, takeLatest, all, call } from 'redux-saga/effects'
import { getFirebase } from '../../util/firebase'
import * as actions from './actions'
import { error } from '../../util/log'

export function* register(action) {
  const { email, password } = action.payload
  try {
    yield put(actions.setSubmitted())
    const firebase = yield call(getFirebase)
    yield call(firebase.createUser, {
      email: email,
      password: password
    })
    yield put(actions.registrationSuccess())
  } catch (e) {
    error('Registration failed', e)
    yield put(actions.registrationFailure())
  }
}

export default function* sagas() {
  yield all([fork(takeLatest, actions.REGISTER, register)])
}
