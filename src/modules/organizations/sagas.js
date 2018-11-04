import { fork, takeEvery, all, call, put, select } from 'redux-saga/effects'
import { getFirebase, getFirestore } from '../../util/firebase'
import * as actions from './actions'
import { error } from '../../util/log'

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
  yield call(firestore.unsetListener, { collection: 'organizations' })
}

export function* createOrganization({ payload: { data } }) {
  try {
    const firestore = yield call(getFirestore)
    const user = yield call(getCurrentUser)
    yield call(
      firestore.set,
      {
        collection: 'organizations',
        doc: data.name
      },
      {
        owner: user.ref
      }
    )
    yield put(actions.createOrganizationSuccess())
  } catch (e) {
    error(`Failed to create organization ${data.name}`, e)
    yield put(actions.createOrganizationFailure())
  }
}

export function* selectOrganization({ payload: { id } }) {
  const firebase = yield call(getFirebase)
  yield call(firebase.updateProfile, { selectedOrganization: id })
}

export function* deleteOrganization({ payload: { id } }) {
  try {
    const firestore = yield call(getFirestore)
    yield call(firestore.delete, { collection: 'organizations', doc: id }, {})
    yield put(actions.deleteOrganizationSuccess())
  } catch (e) {
    error(`Failed to delete organization ${id}`, e)
    yield put(actions.deleteOrganizationFailure())
  }
}

export default function* sagas() {
  yield all([
    fork(takeEvery, actions.WATCH_ORGANIZATIONS, watchOrganizations),
    fork(takeEvery, actions.UNWATCH_ORGANIZATIONS, unwatchOrganizations),
    fork(takeEvery, actions.CREATE_ORGANIZATION, createOrganization),
    fork(takeEvery, actions.SELECT_ORGANIZATION, selectOrganization),
    fork(takeEvery, actions.DELETE_ORGANIZATION, deleteOrganization)
  ])
}
