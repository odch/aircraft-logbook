import { takeEvery, all, call, put, select } from 'redux-saga/effects'
import * as actions from './actions'
import { callFunction } from '../../../../../util/firebase'
import {
  getDoc,
  updateDoc,
  addArrayItem
} from '../../../../../util/firestoreUtils'
import { fetchOrganizations } from '../../../../../modules/app'

export const uidSelector = state => state.firebase.auth.uid

export function* fetchInvite({ payload: { organizationId, inviteId } }) {
  const { data } = yield call(callFunction, 'fetchInvite', {
    organizationId,
    inviteId
  })
  yield put(actions.setInvite(data))
}

export function* acceptInvite({ payload: { organizationId, inviteId } }) {
  yield put(actions.setAcceptInProgress())
  const uid = yield select(uidSelector)
  const user = yield call(getDoc, ['users', uid])
  yield call(
    updateDoc,
    ['organizations', organizationId, 'members', inviteId],
    {
      user: user.ref
    }
  )
  const org = yield call(getDoc, ['organizations', organizationId])
  yield call(addArrayItem, ['users', user.id], 'organizations', org.ref)
  yield put(fetchOrganizations())
  yield put(actions.fetchInvite(organizationId, inviteId))
}

export default function* sagas() {
  yield all([
    takeEvery(actions.FETCH_INVITE, fetchInvite),
    takeEvery(actions.ACCEPT_INVITE, acceptInvite)
  ])
}
