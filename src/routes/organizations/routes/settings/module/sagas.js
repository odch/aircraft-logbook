import { fork, takeEvery, all, call, put } from 'redux-saga/effects'
import * as actions from './actions'
import { fetchMembers } from '../../../module'
import { error } from '../../../../../util/log'
import { addDoc } from '../../../../../util/firestoreUtils'

export function* createMember({ payload: { organizationId, data } }) {
  try {
    yield put(actions.setCreateMemberDialogSubmitting())
    yield call(addDoc, ['organizations', organizationId, 'members'], data)
    yield put(fetchMembers(organizationId))
    yield put(actions.createMemberSuccess())
  } catch (e) {
    error(`Failed to add member ${data.firstname} ${data.lastname}`, e)
    yield put(actions.createMemberFailure())
  }
}

export default function* sagas() {
  yield all([fork(takeEvery, actions.CREATE_MEMBER, createMember)])
}
