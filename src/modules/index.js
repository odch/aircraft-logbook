import { combineReducers } from 'redux'
import { all, fork } from 'redux-saga/effects'

import login, { sagas as loginSagas } from './login'
import registration, { sagas as registrationSagas } from './registration'

const reducer = combineReducers({
  login,
  registration
})

export const sagas = function* rootSaga() {
  yield all([fork(loginSagas), fork(registrationSagas)])
}

export default reducer
