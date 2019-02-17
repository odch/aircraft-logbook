import { fork, takeEvery, all, call, select, put } from 'redux-saga/effects'
import { constants as reduxFirebaseConstants } from 'react-redux-firebase'
import { constants as reduxFirestoreConstants } from 'redux-firestore'
import { getFirebase, getFirestore } from '../../util/firebase'
import * as actions from './actions'

export const uidSelector = state => state.firebase.auth.uid
export const currentUserUid = state => state.firestore.ordered.currentUser[0].id

export const customListenerResponseSagas = {
  currentUser: fetchMyOrganizations
}

export function* watchCurrentUser() {
  const firestore = yield call(getFirestore)
  const uid = yield select(uidSelector)
  if (!uid) {
    throw 'UID not available'
  }
  yield call(firestore.setListener, {
    collection: 'users',
    doc: uid,
    storeAs: 'currentUser',
    listenerId: 'currentUser'
  })
}

export function* unwatchCurrentUser() {
  const firestore = yield call(getFirestore)
  const uid = yield select(currentUserUid)
  yield call(firestore.unsetListener, {
    collection: 'users',
    doc: uid
  })
}

export function* fetchMyOrganizations(action) {
  let organizations = []

  if (action.payload.data) {
    const organizationRefs = action.payload.ordered[0].organizations
    if (organizationRefs) {
      const organizationDocs = yield all(
        organizationRefs.map(ref => call(ref.get.bind(ref)))
      )
      organizations = organizationDocs.map(doc => doc.data())
    }
  }

  yield put(actions.setMyOrganizations(organizations))
}

export function* onListenerResponse(action) {
  const listenerId = action.meta.listenerId
  if (listenerId) {
    const customSaga = customListenerResponseSagas[listenerId]
    if (customSaga) {
      yield call(customSaga, action)
    }
  }
}

export const collectReferences = (data, referenceItems) => {
  const references = []

  if (data) {
    Object.keys(data).forEach(key => {
      const record = data[key]

      Object.keys(record)
        .filter(item => referenceItems.includes(item))
        .forEach(item => {
          const ref = record[item]
          if (ref) {
            references.push({ id: { key, item }, ref })
          }
        })
    })
  }

  return references
}

export function* resolveReference(id, ref) {
  const doc = yield call(ref.get.bind(ref))
  const data = doc.data()
  return {
    id,
    data
  }
}

export const populate = (resolvedDocs, data, orderedData) => {
  resolvedDocs.forEach(doc => {
    const { key, item } = doc.id

    data[key][item] = doc.data
    orderedData.find(rec => rec.id === key)[item] = doc.data
  })
}

export function* populateAndPutAgain(action) {
  const references = collectReferences(
    action.payload.data,
    action.meta.populate
  )

  if (references.length > 0) {
    const resolvingFunctions = references.map(obj =>
      call(resolveReference, obj.id, obj.ref)
    )
    const result = yield all(resolvingFunctions)

    populate(result, action.payload.data, action.payload.ordered)

    // delete populate property to avoid repeated population
    delete action.meta.populate

    yield put(action)
  }
}

export function* onGetSuccess(action) {
  if (action.meta.populate) {
    yield call(populateAndPutAgain, action)
  }
}

export function* logout() {
  const firebase = yield call(getFirebase)
  yield call(firebase.logout)
}

export function* watchAerodromes() {
  const firestore = yield call(getFirestore)
  yield call(firestore.setListener, {
    collection: 'aerodromes',
    orderBy: 'name',
    storeAs: 'allAerodromes'
  })
}

export default function* sagas() {
  yield all([
    fork(takeEvery, reduxFirebaseConstants.actionTypes.LOGIN, watchCurrentUser),
    fork(
      takeEvery,
      reduxFirebaseConstants.actionTypes.LOGOUT,
      unwatchCurrentUser
    ),
    fork(
      takeEvery,
      reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
      onListenerResponse
    ),
    fork(
      takeEvery,
      reduxFirestoreConstants.actionTypes.GET_SUCCESS,
      onGetSuccess
    ),
    fork(takeEvery, actions.LOGOUT, logout),
    fork(takeEvery, actions.WATCH_AERODROMES, watchAerodromes)
  ])
}
