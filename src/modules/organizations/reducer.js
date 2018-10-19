import { createReducer } from '../../util/reducer'
import * as actions from './actions'

export const INITIAL_STATE = {
  createDialogOpen: false,
  createDialogData: {
    name: ''
  }
}

const openCreateOrganizationDialog = state => ({
  ...state,
  createDialogOpen: true,
  createDialogData: INITIAL_STATE.createDialogData
})

const updateCreateOrganizationDialogData = (state, action) => ({
  ...state,
  createDialogData: action.payload.data
})

const closeCreateOrganizationDialog = state => ({
  ...state,
  createDialogOpen: false
})

const ACTION_HANDLERS = {
  [actions.OPEN_CREATE_ORGANIZATION_DIALOG]: openCreateOrganizationDialog,
  [actions.CLOSE_CREATE_ORGANIZATION_DIALOG]: closeCreateOrganizationDialog,
  [actions.UPDATE_CREATE_ORGANIZATION_DIALOG_DATA]: updateCreateOrganizationDialogData,
  [actions.CREATE_ORGANIZATION_SUCCESS]: closeCreateOrganizationDialog
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
