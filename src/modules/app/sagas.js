import { fork, takeEvery, all, call, select } from 'redux-saga/effects'
import { constants } from 'react-redux-firebase'
import { getFirebase, getFirestore } from '../../util/firebase'
import * as actions from './actions'

export const uidSelector = state => state.firebase.auth.uid

export function* getCurrentUser() {
  const firestore = yield call(getFirestore)
  const uid = yield select(uidSelector)
  if (uid) {
    const user = yield call(firestore.get, {
      collection: 'users',
      doc: uid
    })
    if (!user) {
      throw new Error(`User for id ${uid} not found`)
    }
    return user
  }
  return null
}

export function* watchOrganizations() {
  const firestore = yield call(getFirestore)
  const user = yield call(getCurrentUser)
  if (user) {
    yield call(firestore.setListener, {
      collection: 'organizations',
      where: ['owner', '==', user.ref]
    })
  }
}

export function* unwatchOrganizations() {
  const firestore = yield call(getFirestore)
  yield call(firestore.unsetListener, {
    collection: 'organizations',
    where: ['owner', '==', {}] // empty object is enough to match listener id
  })
}

export function* logout() {
  const firebase = yield call(getFirebase)
  yield call(firebase.logout)
}

export default function* sagas() {
  yield all([
    fork(takeEvery, constants.actionTypes.LOGIN, watchOrganizations),
    fork(takeEvery, constants.actionTypes.LOGOUT, unwatchOrganizations),
    fork(takeEvery, actions.LOGOUT, logout)
  ])
}
