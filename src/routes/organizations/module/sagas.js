import { takeEvery, all, call, put, select } from 'redux-saga/effects'
import { callFunction, getFirebase, getFirestore } from '../../../util/firebase'
import * as actions from './actions'
import { fetchOrganizations } from '../../../modules/app'
import { error } from '../../../util/log'
import { updateDoc } from '../../../util/firestoreUtils'

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

export function* createOrganization({ payload: { data } }) {
  try {
    yield put(actions.setCreateOrganizationDialogSubmitted())
    yield call(callFunction, 'addOrganization', data)
    yield put(fetchOrganizations())
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
    yield call(updateDoc, ['organizations', id], { deleted: true })
    yield put(fetchOrganizations())
    yield put(actions.deleteOrganizationSuccess())
  } catch (e) {
    error(`Failed to delete organization ${id}`, e)
    yield put(actions.deleteOrganizationFailure())
  }
}

export function* fetchAircrafts({ payload: { organizationId } }) {
  const firestore = yield call(getFirestore)
  yield call(
    firestore.get,
    {
      collection: 'organizations',
      doc: organizationId,
      subcollections: [{ collection: 'aircrafts' }],
      where: ['deleted', '==', false],
      orderBy: 'registration',
      storeAs: 'organizationAircrafts'
    },
    {}
  )
}

export function* fetchMembers({ payload: { organizationId } }) {
  const firestore = yield call(getFirestore)
  yield call(
    firestore.get,
    {
      collection: 'organizations',
      doc: organizationId,
      subcollections: [{ collection: 'members' }],
      where: ['deleted', '==', false],
      orderBy: [['lastname'], ['firstname']],
      storeAs: 'organizationMembers'
    },
    {}
  )
}

export function* fetchAerodromes({ payload: { organizationId } }) {
  const firestore = yield call(getFirestore)
  yield call(
    firestore.get,
    {
      collection: 'organizations',
      doc: organizationId,
      subcollections: [{ collection: 'aerodromes' }],
      where: ['deleted', '==', false],
      orderBy: [['name'], ['identification']],
      storeAs: 'organizationAerodromes'
    },
    {}
  )
}

export default function* sagas() {
  yield all([
    takeEvery(actions.CREATE_ORGANIZATION, createOrganization),
    takeEvery(actions.SELECT_ORGANIZATION, selectOrganization),
    takeEvery(actions.DELETE_ORGANIZATION, deleteOrganization),
    takeEvery(actions.FETCH_AIRCRAFTS, fetchAircrafts),
    takeEvery(actions.FETCH_MEMBERS, fetchMembers),
    takeEvery(actions.FETCH_AERODROMES, fetchAerodromes)
  ])
}
