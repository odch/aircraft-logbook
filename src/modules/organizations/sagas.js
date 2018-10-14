import { fork, takeLatest, all, call } from 'redux-saga/effects'
import { getFirestore } from 'redux-firestore'
import * as actions from './actions'

export function* loadOrganizations() {
  const firestore = yield call(getFirestore)
  yield call(firestore.get, 'organizations')
}

export default function* sagas() {
  yield all([fork(takeLatest, actions.LOAD_ORGANIZATIONS, loadOrganizations)])
}
