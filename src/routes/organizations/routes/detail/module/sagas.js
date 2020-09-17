import { takeEvery, all, call, put } from 'redux-saga/effects'
import { error } from '../../../../../util/log'
import { getFirestore } from '../../../../../util/firebase'
import { addDoc } from '../../../../../util/firestoreUtils'
import { fetchAircrafts } from '../../../module'
import * as actions from './actions'

export function* aircraftExists(organizationId, registration) {
  const firestore = yield call(getFirestore)
  const existingAircraft = yield call(firestore.get, {
    collection: 'organizations',
    doc: organizationId,
    subcollections: [{ collection: 'aircrafts' }],
    where: [
      ['deleted', '==', false],
      ['registration', '==', registration]
    ],
    limit: 1,
    storeAs: 'existingAircraft'
  })
  return existingAircraft.size === 1
}

export function* createAircraft({ payload: { organizationId, data } }) {
  try {
    yield put(actions.setCreateAircraftDialogSubmitted())
    const dataToStore = {
      ...data,
      deleted: false
    }
    const alreadyExists = yield call(
      aircraftExists,
      organizationId,
      data.registration
    )
    if (alreadyExists) {
      yield put(actions.setCreateAircraftDuplicate())
    } else {
      yield call(
        addDoc,
        ['organizations', organizationId, 'aircrafts'],
        dataToStore
      )
      yield put(fetchAircrafts(organizationId))
      yield put(actions.createAircraftSuccess())
    }
  } catch (e) {
    error(`Failed to create aircraft ${data.registration}`, e)
    yield put(actions.createAircraftFailure())
  }
}

export default function* sagas() {
  yield all([takeEvery(actions.CREATE_AIRCRAFT, createAircraft)])
}
