import * as actions from './actions'
import { createReducer } from '../../../util/reducer'

export const INITIAL_STATE = {
  data: {
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  },
  failed: false,
  submitted: false
}

const updateData = (state, action) => ({
  ...state,
  data: {
    ...state.data,
    ...action.payload.data
  },
  failed: false
})

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
  [actions.UPDATE_DATA]: updateData,
  [actions.REGISTRATION_SUCCESS]: registrationSuccess,
  [actions.REGISTRATION_FAILURE]: registrationFailure,
  [actions.SET_SUBMITTED]: setSubmitted
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
