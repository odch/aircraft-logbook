import {
  takeEvery,
  takeLatest,
  all,
  call,
  put,
  select
} from 'redux-saga/effects'
import * as actions from './actions'
import { fetchMembers, fetchAircrafts } from '../../../module'
import { fetchOrganizations } from '../../../../../modules/app'
import { error } from '../../../../../util/log'
import { callFunction } from '../../../../../util/firebase'
import download from '../../../../../util/download'

export const tokenSelector = state =>
  state.firebase.auth.stsTokenManager.accessToken

export function* createMember({ payload: { organizationId, data } }) {
  try {
    const result = yield call(callFunction, 'addMember', {
      organizationId,
      member: data
    })
    if (result && result.data && result.data.error) {
      yield put(
        actions.createMemberFailure({
          [result.data.error]: true
        })
      )
    } else {
      yield put(fetchMembers(organizationId))
      yield put(actions.createMemberSuccess())
    }
  } catch (e) {
    error(`Failed to add member ${data.firstname} ${data.lastname}`, e)
    yield put(actions.createMemberFailure())
  }
}

export function* deleteMember({ payload: { organizationId, memberId } }) {
  yield call(callFunction, 'deleteMember', {
    organizationId,
    memberId
  })
  yield put(fetchMembers(organizationId))
  yield put(actions.closeDeleteMemberDialog())
}

export function* removeUserLink({ payload: { organizationId, memberId } }) {
  yield call(callFunction, 'removeUserLink', {
    organizationId,
    memberId
  })
  yield put(fetchMembers(organizationId))
  yield put(actions.closeRemoveUserLinkDialog())
}

export function* updateMember({ payload: { organizationId, memberId, data } }) {
  try {
    const result = yield call(callFunction, 'updateMember', {
      organizationId,
      memberId,
      member: data
    })
    if (result && result.data && result.data.error) {
      yield put(
        actions.updateMemberFailure({
          [result.data.error]: true
        })
      )
    } else {
      yield put(fetchMembers(organizationId))
      yield put(actions.updateMemberSuccess())
    }
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
  const fileName = `flights_${organizationId}_${new Date()
    .toISOString()
    .substring(0, 10)}.csv`
  await download(url, token, fileName)
}

export function* updateLockDate({ payload: { organizationId, date } }) {
  try {
    yield call(callFunction, 'updateLockDate', {
      organizationId,
      date
    })
    yield put(fetchOrganizations())
    yield put(fetchAircrafts(organizationId))
    yield put(actions.updateLockDateSuccess())
  } catch (e) {
    yield put(actions.updateLockDateFailure())
  }
}

export function* setReadonlyAccessEnabled({
  payload: { organizationId, enabled }
}) {
  try {
    yield call(callFunction, 'setReadonlyAccessEnabled', {
      organizationId,
      enabled
    })
    yield put(fetchOrganizations())
    yield put(actions.setReadonlyAccessEnabledSuccess())
  } catch (e) {
    error(
      `Failed to set readonly access enabled/disabled (org: ${organizationId})`,
      e
    )
    yield put(actions.setReadonlyAccessEnabledFailure())
  }
}

export default function* sagas() {
  yield all([
    takeEvery(actions.CREATE_MEMBER, createMember),
    takeEvery(actions.DELETE_MEMBER, deleteMember),
    takeEvery(actions.REMOVE_USER_LINK, removeUserLink),
    takeEvery(actions.UPDATE_MEMBER, updateMember),
    takeEvery(actions.EXPORT_FLIGHTS, exportFlights),
    takeLatest(actions.UPDATE_LOCK_DATE, updateLockDate),
    takeLatest(actions.SET_READONLY_ACCESS_ENABLED, setReadonlyAccessEnabled)
  ])
}
