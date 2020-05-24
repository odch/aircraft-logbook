export const OPEN_CREATE_CHECK_DIALOG =
  'aircraftSettings/OPEN_CREATE_CHECK_DIALOG'
export const CLOSE_CREATE_CHECK_DIALOG =
  'aircraftSettings/CLOSE_CREATE_CHECK_DIALOG'
export const UPDATE_CREATE_CHECK_DIALOG_DATA =
  'aircraftSettings/UPDATE_CREATE_CHECK_DIALOG_DATA'
export const CREATE_CHECK = 'aircraftSettings/CREATE_CHECK'
export const SET_CREATE_CHECK_DIALOG_SUBMITTING =
  'aircraftSettings/SET_CREATE_CHECK_DIALOG_SUBMITTING'
export const CREATE_CHECK_SUCCESS = 'aircraftSettings/CREATE_CHECK_SUCCESS'
export const CREATE_CHECK_FAILURE = 'aircraftSettings/CREATE_CHECK_FAILURE'
export const OPEN_CREATE_FUEL_TYPE_DIALOG =
  'aircraftSettings/OPEN_CREATE_FUEL_TYPE_DIALOG'
export const CLOSE_CREATE_FUEL_TYPE_DIALOG =
  'aircraftSettings/CLOSE_CREATE_FUEL_TYPE_DIALOG'
export const UPDATE_CREATE_FUEL_TYPE_DIALOG_DATA =
  'aircraftSettings/UPDATE_CREATE_FUEL_TYPE_DIALOG_DATA'
export const CREATE_FUEL_TYPE = 'aircraftSettings/CREATE_FUEL_TYPE'
export const SET_CREATE_FUEL_TYPE_DIALOG_SUBMITTING =
  'aircraftSettings/SET_CREATE_FUEL_TYPE_DIALOG_SUBMITTING'
export const CREATE_FUEL_TYPE_SUCCESS =
  'aircraftSettings/CREATE_FUEL_TYPE_SUCCESS'
export const CREATE_FUEL_TYPE_FAILURE =
  'aircraftSettings/CREATE_FUEL_TYPE_FAILURE'

export const openCreateCheckDialog = () => ({
  type: OPEN_CREATE_CHECK_DIALOG
})

export const closeCreateCheckDialog = () => ({
  type: CLOSE_CREATE_CHECK_DIALOG
})

export const updateCreateCheckDialogData = data => ({
  type: UPDATE_CREATE_CHECK_DIALOG_DATA,
  payload: {
    data
  }
})

export const createCheck = (organizationId, aircraftId, data) => ({
  type: CREATE_CHECK,
  payload: {
    organizationId,
    aircraftId,
    data
  }
})

export const setCreateCheckDialogSubmitting = () => ({
  type: SET_CREATE_CHECK_DIALOG_SUBMITTING
})

export const createCheckSuccess = () => ({
  type: CREATE_CHECK_SUCCESS
})

export const createCheckFailure = () => ({
  type: CREATE_CHECK_FAILURE
})

export const openCreateFuelTypeDialog = () => ({
  type: OPEN_CREATE_FUEL_TYPE_DIALOG
})

export const closeCreateFuelTypeDialog = () => ({
  type: CLOSE_CREATE_FUEL_TYPE_DIALOG
})

export const updateCreateFuelTypeDialogData = data => ({
  type: UPDATE_CREATE_FUEL_TYPE_DIALOG_DATA,
  payload: {
    data
  }
})

export const createFuelType = (organizationId, aircraftId, data) => ({
  type: CREATE_FUEL_TYPE,
  payload: {
    organizationId,
    aircraftId,
    data
  }
})

export const setCreateFuelTypeDialogSubmitting = () => ({
  type: SET_CREATE_FUEL_TYPE_DIALOG_SUBMITTING
})

export const createFuelTypeSuccess = () => ({
  type: CREATE_FUEL_TYPE_SUCCESS
})

export const createFuelTypeFailure = () => ({
  type: CREATE_FUEL_TYPE_FAILURE
})
