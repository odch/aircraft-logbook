import { combineReducers } from 'redux'
import { all, fork } from 'redux-saga/effects'

import login, { sagas as loginSagas } from './login'

const reducer = combineReducers({
  login
})

export const sagas = function* rootSaga() {
  yield all([fork(loginSagas)])
}

export default reducer
