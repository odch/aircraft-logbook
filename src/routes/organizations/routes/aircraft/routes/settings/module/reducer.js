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
  deleteCheckDialog: {
    open: false,
    submitting: false,
    check: null
  },
  createFuelTypeDialog: {
    open: false,
    submitting: false,
    data: {
      name: '',
      description: ''
    }
  },
  deleteFuelTypeDialog: {
    open: false,
    submitting: false,
    fuelType: null
  },
  advancedSettings: {
    submitting: {}
  },
  deleteAircraftDialog: {
    open: false,
    submitting: false
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

const setCreateCheckDialogSubmitting = submitting => state => ({
  ...state,
  createCheckDialog: {
    ...state.createCheckDialog,
    submitting
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

const openDeleteCheckDialog = (state, { payload }) => ({
  ...state,
  deleteCheckDialog: {
    ...INITIAL_STATE.deleteCheckDialog,
    open: true,
    check: payload.check
  }
})

const closeDeleteCheckDialog = state => ({
  ...state,
  deleteCheckDialog: {
    open: false
  }
})

const setDeleteCheckDialogSubmitting = state => ({
  ...state,
  deleteCheckDialog: {
    ...state.deleteCheckDialog,
    submitting: true
  }
})

const openDeleteFuelTypeDialog = (state, { payload }) => ({
  ...state,
  deleteFuelTypeDialog: {
    ...INITIAL_STATE.deleteFuelTypeDialog,
    open: true,
    fuelType: payload.fuelType
  }
})

const closeDeleteFuelTypeDialog = state => ({
  ...state,
  deleteFuelTypeDialog: {
    open: false
  }
})

const setDeleteFuelTypeDialogSubmitting = state => ({
  ...state,
  deleteFuelTypeDialog: {
    ...state.deleteFuelTypeDialog,
    submitting: true
  }
})

const setSettingSubmitting = (state, { payload }) => ({
  ...state,
  advancedSettings: {
    ...state.advancedSettings,
    submitting: {
      ...state.advancedSettings.submitting,
      [payload.name]: payload.submitting
    }
  }
})

const openDeleteAircraftDialog = state => ({
  ...state,
  deleteAircraftDialog: {
    ...INITIAL_STATE.deleteAircraftDialog,
    open: true
  }
})

const closeDeleteAircraftDialog = state => ({
  ...state,
  deleteAircraftDialog: {
    ...state.deleteAircraft,
    open: false
  }
})

const setDeleteAircraftDialogSubmitting = state => ({
  ...state,
  deleteAircraftDialog: {
    ...state.deleteAircraftDialog,
    submitting: true
  }
})

const ACTION_HANDLERS = {
  [actions.OPEN_CREATE_CHECK_DIALOG]: openCreateCheckDialog,
  [actions.CLOSE_CREATE_CHECK_DIALOG]: closeCreateCheckDialog,
  [actions.CREATE_CHECK_SUCCESS]: closeCreateCheckDialog,
  [actions.UPDATE_CREATE_CHECK_DIALOG_DATA]: updateCreateCheckDialogData,
  [actions.SET_CREATE_CHECK_DIALOG_SUBMITTING]: setCreateCheckDialogSubmitting(
    true
  ),
  [actions.CREATE_CHECK_FAILURE]: setCreateCheckDialogSubmitting(false),
  [actions.OPEN_CREATE_FUEL_TYPE_DIALOG]: openCreateFuelTypeDialog,
  [actions.CLOSE_CREATE_FUEL_TYPE_DIALOG]: closeCreateFuelTypeDialog,
  [actions.CREATE_FUEL_TYPE_SUCCESS]: closeCreateFuelTypeDialog,
  [actions.UPDATE_CREATE_FUEL_TYPE_DIALOG_DATA]: updateCreateFuelTypeDialogData,
  [actions.CREATE_FUEL_TYPE]: setCreateFuelTypeDialogSubmitting,
  [actions.OPEN_DELETE_CHECK_DIALOG]: openDeleteCheckDialog,
  [actions.CLOSE_DELETE_CHECK_DIALOG]: closeDeleteCheckDialog,
  [actions.SET_DELETE_CHECK_DIALOG_SUBMITTING]: setDeleteCheckDialogSubmitting,
  [actions.OPEN_DELETE_FUEL_TYPE_DIALOG]: openDeleteFuelTypeDialog,
  [actions.CLOSE_DELETE_FUEL_TYPE_DIALOG]: closeDeleteFuelTypeDialog,
  [actions.DELETE_FUEL_TYPE]: setDeleteFuelTypeDialogSubmitting,
  [actions.SET_SETTING_SUBMITTING]: setSettingSubmitting,
  [actions.OPEN_DELETE_AIRCRAFT_DIALOG]: openDeleteAircraftDialog,
  [actions.CLOSE_DELETE_AIRCRAFT_DIALOG]: closeDeleteAircraftDialog,
  [actions.SET_DELETE_AIRCRAFT_DIALOG_SUBMITTING]: setDeleteAircraftDialogSubmitting
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
