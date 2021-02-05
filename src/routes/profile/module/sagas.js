import { takeLatest, all, call } from 'redux-saga/effects'
import { getFirebase } from '../../../util/firebase'
import * as actions from './actions'

export function* updateLocale({ payload: { locale } }) {
  const firebase = yield call(getFirebase)
  yield call(firebase.updateProfile, { locale })
}

export default function* sagas() {
  yield all([takeLatest(actions.UPDATE_LOCALE, updateLocale)])
}
