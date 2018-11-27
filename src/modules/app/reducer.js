import * as actions from './actions'
import { createReducer } from '../../util/reducer'

const INITIAL_STATE = {}

const setMyOrganizations = (state, action) => ({
  ...state,
  organizations: action.payload.organizations
})

const ACTION_HANDLERS = {
  [actions.SET_MY_ORGANIZATIONS]: setMyOrganizations
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
