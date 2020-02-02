import { takeEvery, all, call, put, select } from 'redux-saga/effects'
import * as actions from './actions'
import { fetchMembers } from '../../../module'
import { error } from '../../../../../util/log'
import { addDoc, updateDoc } from '../../../../../util/firestoreUtils'
import { getFirestore } from '../../../../../util/firebase'

export const tokenSelector = state =>
  state.firebase.auth.stsTokenManager.accessToken

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

export function* updateMember({ payload: { organizationId, memberId, data } }) {
  try {
    yield put(actions.setEditMemberDialogSubmitting())

    const dataToStore = {
      ...data
    }

    if (dataToStore.reinvite === true) {
      const firestore = yield call(getFirestore)
      dataToStore.inviteTimestamp = firestore.FieldValue.delete()
      delete dataToStore.reinvite
    }

    yield call(
      updateDoc,
      ['organizations', organizationId, 'members', memberId],
      dataToStore
    )

    yield put(fetchMembers(organizationId))
    yield put(actions.updateMemberSuccess())
  } catch (e) {
    error(`Failed to update member ${memberId} (org: ${organizationId})`, e)
    yield put(actions.updateMemberFailure())
  }
}

export function* exportFlights({
  payload: { organizationId, startDate, endDate }
}) {
  yield put(actions.setExportFlightsDialogSubmitting(true))

  const token = yield select(tokenSelector)

  yield call(generateExport, organizationId, startDate, endDate, token)

  yield put(actions.setExportFlightsDialogSubmitting(false))
}

export async function generateExport(
  organizationId,
  startDate,
  endDate,
  token
) {
  const url = `https://us-central1-${__CONF__.firebase.projectId}.cloudfunctions.net/api/flights?organization=${organizationId}&start=${startDate}&end=${endDate}`

  const response = await fetch(url, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
  const blob = await response.blob()

  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `flights_${organizationId}_${new Date()
    .toISOString()
    .substring(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export default function* sagas() {
  yield all([
    takeEvery(actions.CREATE_MEMBER, createMember),
    takeEvery(actions.DELETE_MEMBER, deleteMember),
    takeEvery(actions.UPDATE_MEMBER, updateMember),
    takeEvery(actions.EXPORT_FLIGHTS, exportFlights)
  ])
}
