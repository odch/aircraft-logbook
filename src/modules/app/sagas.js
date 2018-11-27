import { fork, takeEvery, all, call, select, put } from 'redux-saga/effects'
import { constants as reduxFirebaseConstants } from 'react-redux-firebase'
import { constants as reduxFirestoreConstants } from 'redux-firestore'
import { getFirebase, getFirestore } from '../../util/firebase'
import * as actions from './actions'

export const uidSelector = state => state.firebase.auth.uid
export const currentUserUid = state => state.firestore.ordered.currentUser[0].id

export const customListenerResponseSagas = {
  currentUser: fetchMyOrganizations
}

export function* watchCurrentUser() {
  const firestore = yield call(getFirestore)
  const uid = yield select(uidSelector)
  if (!uid) {
    throw 'UID not available'
  }
  yield call(firestore.setListener, {
    collection: 'users',
    doc: uid,
    storeAs: 'currentUser',
    listenerId: 'currentUser'
  })
}

export function* unwatchCurrentUser() {
  const firestore = yield call(getFirestore)
  const uid = yield select(currentUserUid)
  yield call(firestore.unsetListener, {
    collection: 'users',
    doc: uid
  })
}

export function* fetchMyOrganizations(action) {
  const organizationRefs = action.payload.ordered[0].organizations
  const organizationDocs = yield all(
    organizationRefs.map(ref => call(ref.get.bind(ref)))
  )
  const orgData = organizationDocs.map(doc => doc.data())
  yield put(actions.setMyOrganizations(orgData))
}

export function* onListenerResponse(action) {
  const listenerId = action.meta.listenerId
  if (listenerId) {
    const customSaga = customListenerResponseSagas[listenerId]
    if (customSaga) {
      yield call(customSaga, action)
    }
  }
}

export function* logout() {
  const firebase = yield call(getFirebase)
  yield call(firebase.logout)
}

export default function* sagas() {
  yield all([
    fork(takeEvery, reduxFirebaseConstants.actionTypes.LOGIN, watchCurrentUser),
    fork(
      takeEvery,
      reduxFirebaseConstants.actionTypes.LOGOUT,
      unwatchCurrentUser
    ),
    fork(
      takeEvery,
      reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
      onListenerResponse
    ),
    fork(takeEvery, actions.LOGOUT, logout)
  ])
}
