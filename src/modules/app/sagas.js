import { takeEvery, all, call, select, put } from 'redux-saga/effects'
import { constants as reduxFirebaseConstants } from 'react-redux-firebase'
import { constants as reduxFirestoreConstants } from 'redux-firestore'
import { getFirebase, getFirestore } from '../../util/firebase'
import { getDoc } from '../../util/firestoreUtils'
import * as actions from './actions'

export const uidSelector = state => state.firebase.auth.uid
export const currentUserUid = state => state.firestore.data.currentUser.id

export function* onLogin() {
  const firebase = yield call(getFirebase)
  const firestore = yield call(getFirestore)

  // Calling `updateProfile` is sort of a workaround because it seems
  // like react-redux-firebase doesn't always create the user profile
  // in the Firestore database when a new user is created.
  // If we update the profile here, it's always created correctly.
  yield call(firebase.updateProfile, { lastLogin: new Date() })

  const uid = yield select(uidSelector)
  if (!uid) {
    throw 'UID not available'
  }
  if (uid === 'readonly') {
    const user = firebase.auth().currentUser
    const idTokenResult = yield call({
      context: user,
      fn: user.getIdTokenResult
    })
    const org = idTokenResult.claims.organization
    yield put(actions.setMyOrganizations([{ id: org, readonly: true }]))
  } else {
    yield call(firestore.setListener, {
      collection: 'users',
      doc: uid,
      storeAs: 'currentUser'
    })
    yield put(actions.fetchOrganizations())
  }
}

export function* unwatchCurrentUser() {
  const firestore = yield call(getFirestore)
  const uid = yield select(currentUserUid)
  yield call(firestore.unsetListener, {
    collection: 'users',
    doc: uid
  })
}

export function* getWithRoles(org) {
  const organizationDoc = yield call(org.ref.get.bind(org.ref))
  if (organizationDoc.exists === true) {
    const data = organizationDoc.data()
    if (data.deleted !== true) {
      return {
        ...data,
        id: organizationDoc.id,
        roles: org.roles
      }
    }
  }
  return null
}

export function* fetchOrganizations() {
  let organizations = []

  const uid = yield select(uidSelector)
  if (!uid) {
    throw 'UID not available'
  }
  const userDoc = yield call(getDoc, ['users', uid])
  const orgs = userDoc.get('orgs')
  if (orgs) {
    if (Object.keys(orgs).length > 0) {
      organizations = yield all(
        Object.keys(orgs).map(orgKey => call(getWithRoles, orgs[orgKey]))
      )
      organizations = organizations.filter(org => org != null)
    }
    yield put(actions.setMyOrganizations(organizations))
  } else {
    // set to loading state
    yield put(actions.setMyOrganizations(undefined))
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
  let data = ref

  if (ref && typeof ref.get === 'function') {
    const doc = yield call(ref.get.bind(ref))
    data = doc.data()
  }

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

export function* onListenerResponse(action) {
  if (action.meta.storeAs === 'currentUser') {
    yield call(fetchOrganizations)
  }
}

export function* logout() {
  const firebase = yield call(getFirebase)
  yield call(firebase.logout)
  yield put(actions.setMyOrganizations(undefined))
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
    takeEvery(reduxFirebaseConstants.actionTypes.LOGIN, onLogin),
    takeEvery(reduxFirebaseConstants.actionTypes.LOGOUT, unwatchCurrentUser),
    takeEvery(reduxFirestoreConstants.actionTypes.GET_SUCCESS, onGetSuccess),
    takeEvery(
      reduxFirestoreConstants.actionTypes.LISTENER_RESPONSE,
      onListenerResponse
    ),
    takeEvery(actions.LOGOUT, logout),
    takeEvery(actions.WATCH_AERODROMES, watchAerodromes),
    takeEvery(actions.FETCH_ORGANIZATIONS, fetchOrganizations)
  ])
}
