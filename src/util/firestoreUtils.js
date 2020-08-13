import { call } from 'redux-saga/effects'
import { getFirestore } from './firebase'

export function* getDoc(path) {
  const pathString = path.join('/')
  const firestore = yield call(getFirestore)
  const doc = yield call(firestore.get, pathString)
  if (!doc) {
    throw new Error(`Doc on path ${pathString} not found`)
  }
  return doc
}

export function* addDoc(path, data) {
  const pathString = path.join('/')
  const firestore = yield call(getFirestore)
  return yield call(firestore.add, pathString, data)
}

export function* updateDoc(path, data) {
  const pathString = path.join('/')
  const firestore = yield call(getFirestore)
  return yield call(firestore.update, pathString, data)
}

export function* addArrayItem(path, arrayPath, item) {
  const pathString = path.join('/')
  const firestore = yield call(getFirestore)
  return yield call(firestore.update, pathString, {
    [arrayPath]: firestore.FieldValue.arrayUnion(item)
  })
}

export function* removeArrayItem(path, arrayPath, item) {
  const pathString = path.join('/')
  const firestore = yield call(getFirestore)
  return yield call(firestore.update, pathString, {
    [arrayPath]: firestore.FieldValue.arrayRemove(item)
  })
}

export function* runTransaction(updateFunction, ...args) {
  const firestore = yield call(getFirestore)
  const updateFn = yield call(updateFunction, ...args)
  return yield call(firestore.runTransaction, updateFn)
}
