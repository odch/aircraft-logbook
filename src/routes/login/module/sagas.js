import { put, takeLatest, all, call } from 'redux-saga/effects'
import MobileDetect from 'mobile-detect'
import { getFirebase, callFunction } from '../../../util/firebase'
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

export function* loginGoogle() {
  try {
    const firebase = yield call(getFirebase)
    const provider = new firebase.auth.GoogleAuthProvider()
    const auth = firebase.auth()
    const fn = new MobileDetect(window.navigator.userAgent).mobile()
      ? auth.signInWithRedirect
      : auth.signInWithPopup
    yield call(
      {
        context: auth,
        fn
      },
      provider
    )
  } catch (e) {
    error('Google login failed', e)
    yield put(actions.loginGoogleFailure())
  }
}

export function* loginWithToken(action) {
  try {
    const firebaseToken = yield call(callFunction, 'getReadonlyToken', {
      token: action.payload.token
    })
    if (firebaseToken && firebaseToken.data) {
      const firebase = yield call(getFirebase)
      const auth = firebase.auth()
      auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
      yield call(
        {
          context: auth,
          fn: auth.signInWithCustomToken
        },
        firebaseToken.data
      )
    } else {
      yield put(actions.tokenLoginFailure())
    }
  } catch (e) {
    error('Login with token failed', e)
    yield put(actions.tokenLoginFailure())
  }
}

export default function* sagas() {
  yield all([
    takeLatest(actions.LOGIN, login),
    takeLatest(actions.LOGIN_GOOGLE, loginGoogle),
    takeLatest(actions.LOGIN_WITH_TOKEN, loginWithToken)
  ])
}
