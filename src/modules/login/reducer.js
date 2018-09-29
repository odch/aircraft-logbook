import * as actions from './actions'
import { createReducer } from '../../util/reducer'

export const INITIAL_STATE = {
  username: '',
  password: '',
  failed: false,
  submitted: false
}

const setUsername = (state, action) => {
  return Object.assign({}, state, {
    username: action.payload.username,
    failed: false
  })
}

const setPassword = (state, action) => {
  return Object.assign({}, state, {
    password: action.payload.password,
    failed: false
  })
}

const loginSuccess = state => {
  return Object.assign({}, state, INITIAL_STATE)
}

const loginFailure = state => {
  return Object.assign({}, state, {
    password: '',
    failed: true,
    submitted: false
  })
}

const setSubmitted = state => {
  return Object.assign({}, state, {
    submitted: true
  })
}

const ACTION_HANDLERS = {
  [actions.SET_USERNAME]: setUsername,
  [actions.SET_PASSWORD]: setPassword,
  [actions.LOGIN_SUCCESS]: loginSuccess,
  [actions.LOGIN_FAILURE]: loginFailure,
  [actions.SET_SUBMITTED]: setSubmitted
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
