import { put, takeLatest, all, call } from 'redux-saga/effects'
import { getFirebase } from '../../../util/firebase'
import * as actions from './actions'
import { error } from '../../../util/log'

export function* login(action) {
  const { username, password } = action.payload
  try {
    yield put(actions.setSubmitted())
    const firebase = yield call(getFirebase)
    yield call(firebase.login, {
      email: username,
      password: password
    })
    yield put(actions.loginSuccess())
  } catch (e) {
    error('Login failed', e)
    yield put(actions.loginFailure())
  }
}

export default function* sagas() {
  yield all([takeLatest(actions.LOGIN, login)])
}
