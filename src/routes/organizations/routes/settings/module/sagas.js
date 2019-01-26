import { fork, takeEvery, all, call, put } from 'redux-saga/effects'
import * as actions from './actions'
import { fetchMembers } from '../../../module'
import { error } from '../../../../../util/log'
import { addDoc, updateDoc } from '../../../../../util/firestoreUtils'

export function* createMember({ payload: { organizationId, data } }) {
  try {
    yield put(actions.setCreateMemberDialogSubmitting())
    const dataToStore = {
      ...data,
      deleted: false
    }
    yield call(
      addDoc,
      ['organizations', organizationId, 'members'],
      dataToStore
    )
    yield put(fetchMembers(organizationId))
    yield put(actions.createMemberSuccess())
  } catch (e) {
    error(`Failed to add member ${data.firstname} ${data.lastname}`, e)
    yield put(actions.createMemberFailure())
  }
}

export function* deleteMember({ payload: { organizationId, memberId } }) {
  yield call(
    updateDoc,
    ['organizations', organizationId, 'members', memberId],
    {
      deleted: true
    }
  )
  yield put(fetchMembers(organizationId))
  yield put(actions.closeDeleteMemberDialog())
}

export default function* sagas() {
  yield all([
    fork(takeEvery, actions.CREATE_MEMBER, createMember),
    fork(takeEvery, actions.DELETE_MEMBER, deleteMember)
  ])
}
