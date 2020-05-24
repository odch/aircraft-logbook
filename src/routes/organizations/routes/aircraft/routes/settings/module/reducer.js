import { createReducer } from '../../../../../../../util/reducer'
import * as actions from './actions'

export const INITIAL_STATE = {
  createCheckDialog: {
    open: false,
    submitting: false,
    valid: false,
    data: {
      description: '',
      dateLimit: null,
      counterLimit: null,
      counterReference: null
    }
  },
  createFuelTypeDialog: {
    open: false,
    submitting: false,
    data: {
      name: '',
      description: ''
    }
  }
}

const openCreateCheckDialog = state => ({
  ...state,
  createCheckDialog: {
    ...INITIAL_STATE.createCheckDialog,
    open: true
  }
})

const closeCreateCheckDialog = state => ({
  ...state,
  createCheckDialog: {
    open: false
  }
})

export const validateCheck = check => {
  if (!check.description) {
    return false
  }
  if (!check.dateLimit && !check.counterLimit) {
    return false
  }
  if (check.counterReference && !check.counterLimit) {
    return false
  }
  if (check.counterLimit && !check.counterReference) {
    return false
  }
  return true
}

const updateCreateCheckDialogData = (state, { payload }) => {
  const newData = {
    ...state.createCheckDialog.data,
    ...payload.data
  }

  if (!newData.counterReference) {
    newData.counterLimit = null
  }

  const valid = validateCheck(newData)

  return {
    ...state,
    createCheckDialog: {
      ...state.createCheckDialog,
      data: newData,
      valid
    }
  }
}

const setCreateCheckDialogSubmitting = state => ({
  ...state,
  createCheckDialog: {
    ...state.createCheckDialog,
    submitting: true
  }
})

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
  [actions.OPEN_CREATE_CHECK_DIALOG]: openCreateCheckDialog,
  [actions.CLOSE_CREATE_CHECK_DIALOG]: closeCreateCheckDialog,
  [actions.CREATE_CHECK_SUCCESS]: closeCreateCheckDialog,
  [actions.UPDATE_CREATE_CHECK_DIALOG_DATA]: updateCreateCheckDialogData,
  [actions.SET_CREATE_CHECK_DIALOG_SUBMITTING]: setCreateCheckDialogSubmitting,
  [actions.OPEN_CREATE_FUEL_TYPE_DIALOG]: openCreateFuelTypeDialog,
  [actions.CLOSE_CREATE_FUEL_TYPE_DIALOG]: closeCreateFuelTypeDialog,
  [actions.CREATE_FUEL_TYPE_SUCCESS]: closeCreateFuelTypeDialog,
  [actions.UPDATE_CREATE_FUEL_TYPE_DIALOG_DATA]: updateCreateFuelTypeDialogData,
  [actions.SET_CREATE_FUEL_TYPE_DIALOG_SUBMITTING]: setCreateFuelTypeDialogSubmitting
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
