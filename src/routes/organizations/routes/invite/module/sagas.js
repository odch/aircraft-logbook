import { takeEvery, all, call, put } from 'redux-saga/effects'
import * as actions from './actions'
import { callFunction } from '../../../../../util/firebase'
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
  yield call(callFunction, 'acceptInvite', {
    organizationId,
    inviteId
  })
  yield put(fetchOrganizations())
  yield put(actions.fetchInvite(organizationId, inviteId))
}

export default function* sagas() {
  yield all([
    takeEvery(actions.FETCH_INVITE, fetchInvite),
    takeEvery(actions.ACCEPT_INVITE, acceptInvite)
  ])
}
