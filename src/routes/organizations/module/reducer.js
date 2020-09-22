import { createReducer } from '../../../util/reducer'
import * as actions from './actions'

export const INITIAL_STATE = {
  createDialog: {
    open: false,
    submitted: false,
    data: {
      name: ''
    }
  }
}

const openCreateOrganizationDialog = state => ({
  ...state,
  createDialog: {
    ...INITIAL_STATE.createDialog,
    open: true
  }
})

const updateCreateOrganizationDialogData = (state, action) => ({
  ...state,
  createDialog: {
    ...state.createDialog,
    data: action.payload.data
  }
})

const closeCreateOrganizationDialog = state => ({
  ...state,
  createDialog: {
    ...state.createDialog,
    open: false
  }
})

const setCreateOrganizationDialogSubmitted = submitted => state => ({
  ...state,
  createDialog: {
    ...state.createDialog,
    submitted
  }
})

const ACTION_HANDLERS = {
  [actions.OPEN_CREATE_ORGANIZATION_DIALOG]: openCreateOrganizationDialog,
  [actions.CLOSE_CREATE_ORGANIZATION_DIALOG]: closeCreateOrganizationDialog,
  [actions.UPDATE_CREATE_ORGANIZATION_DIALOG_DATA]: updateCreateOrganizationDialogData,
  [actions.CREATE_ORGANIZATION_SUCCESS]: closeCreateOrganizationDialog,
  [actions.CREATE_ORGANIZATION_FAILURE]: setCreateOrganizationDialogSubmitted(
    false
  ),
  [actions.SET_CREATE_ORGANIZATION_DIALOG_SUBMITTED]: setCreateOrganizationDialogSubmitted(
    true
  )
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
