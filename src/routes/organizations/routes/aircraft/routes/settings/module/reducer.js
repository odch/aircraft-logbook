import { createReducer } from '../../../../../../../util/reducer'
import * as actions from './actions'

export const INITIAL_STATE = {
  createFuelTypeDialog: {
    open: false,
    submitting: false,
    data: {
      name: '',
      description: ''
    }
  }
}

const openCreateFuelTypeDialog = state => ({
  ...state,
  createFuelTypeDialog: {
    ...INITIAL_STATE.createFuelTypeDialog,
    open: true
  }
})

const closeCreateFuelTypeDialog = state => ({
  ...state,
  createFuelTypeDialog: {
    open: false
  }
})

const updateCreateFuelTypeDialogData = (state, { payload }) => ({
  ...state,
  createFuelTypeDialog: {
    ...state.createFuelTypeDialog,
    data: {
      ...state.createFuelTypeDialog.data,
      ...payload.data
    }
  }
})

const setCreateFuelTypeDialogSubmitting = state => ({
  ...state,
  createFuelTypeDialog: {
    ...state.createFuelTypeDialog,
    submitting: true
  }
})

const ACTION_HANDLERS = {
  [actions.OPEN_CREATE_FUEL_TYPE_DIALOG]: openCreateFuelTypeDialog,
  [actions.CLOSE_CREATE_FUEL_TYPE_DIALOG]: closeCreateFuelTypeDialog,
  [actions.CREATE_FUEL_TYPE_SUCCESS]: closeCreateFuelTypeDialog,
  [actions.UPDATE_CREATE_FUEL_TYPE_DIALOG_DATA]: updateCreateFuelTypeDialogData,
  [actions.SET_CREATE_FUEL_TYPE_DIALOG_SUBMITTING]: setCreateFuelTypeDialogSubmitting
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
