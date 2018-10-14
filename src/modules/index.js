import { combineReducers } from 'redux'
import { all, fork } from 'redux-saga/effects'

import login, { sagas as loginSagas } from './login'
import registration, { sagas as registrationSagas } from './registration'
import organizations, { sagas as organizationsSagas } from './organizations'

const reducer = combineReducers({
  login,
  registration,
  organizations
})

export const sagas = function* rootSaga() {
  yield all([
    fork(loginSagas),
    fork(registrationSagas),
    fork(organizationsSagas)
  ])
}

export default reducer
