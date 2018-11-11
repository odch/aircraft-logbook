import * as actions from './actions'
import { createReducer } from '../../../util/reducer'

export const INITIAL_STATE = {
  email: '',
  password: '',
  failed: false,
  submitted: false
}

const setEmail = (state, action) => {
  return Object.assign({}, state, {
    email: action.payload.email,
    failed: false
  })
}

const setPassword = (state, action) => {
  return Object.assign({}, state, {
    password: action.payload.password,
    failed: false
  })
}

const registrationSuccess = state => {
  return Object.assign({}, state, INITIAL_STATE)
}

const registrationFailure = state => {
  return Object.assign({}, state, {
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
  [actions.SET_EMAIL]: setEmail,
  [actions.SET_PASSWORD]: setPassword,
  [actions.REGISTRATION_SUCCESS]: registrationSuccess,
  [actions.REGISTRATION_FAILURE]: registrationFailure,
  [actions.SET_SUBMITTED]: setSubmitted
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
