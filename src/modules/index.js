import { combineReducers } from 'redux'
import { all, fork } from 'redux-saga/effects'

import app, { sagas as appSagas } from './app'

const reducer = combineReducers({
  app
})

export const sagas = function* rootSaga() {
  yield all([fork(appSagas)])
}

export default reducer
