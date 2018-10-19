import { fork, takeEvery, all, call, put } from 'redux-saga/effects'
import { getFirestore } from 'redux-firestore'
import * as actions from './actions'
import { error } from '../../util/log'

export function* watchOrganizations() {
  const firestore = yield call(getFirestore)
  yield call(firestore.setListener, { collection: 'organizations' })
}

export function* unwatchOrganizations() {
  const firestore = yield call(getFirestore)
  yield call(firestore.unsetListener, { collection: 'organizations' })
}

export function* createOrganization({ payload: { data } }) {
  try {
    const firestore = yield call(getFirestore)
    yield call(
      firestore.set,
      { collection: 'organizations', doc: data.name },
      {}
    )
    yield put(actions.createOrganizationSuccess())
  } catch (e) {
    error(`Failed to create organization ${data.name}`, e)
    yield put(actions.createOrganizationFailure())
  }
}

export default function* sagas() {
  yield all([
    fork(takeEvery, actions.WATCH_ORGANIZATIONS, watchOrganizations),
    fork(takeEvery, actions.UNWATCH_ORGANIZATIONS, unwatchOrganizations),
    fork(takeEvery, actions.CREATE_ORGANIZATION, createOrganization)
  ])
}
