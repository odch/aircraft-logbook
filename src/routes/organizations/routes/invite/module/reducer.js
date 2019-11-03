import { createReducer } from '../../../../../util/reducer'
import * as actions from './actions'

export const INITIAL_STATE = {
  invite: undefined,
  acceptInProgress: false
}

const setInvite = (state, { payload: { invite } }) => ({
  ...state,
  invite,
  acceptInProgress: false
})

const setAcceptInProgress = state => ({
  ...state,
  acceptInProgress: true
})

const ACTION_HANDLERS = {
  [actions.SET_INVITE]: setInvite,
  [actions.SET_ACCEPT_IN_PROGRESS]: setAcceptInProgress
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
