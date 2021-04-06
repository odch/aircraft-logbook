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
export const CREATE_FUEL_TYPE_SUCCESS =
  'aircraftSettings/CREATE_FUEL_TYPE_SUCCESS'
export const CREATE_FUEL_TYPE_FAILURE =
  'aircraftSettings/CREATE_FUEL_TYPE_FAILURE'
export const OPEN_DELETE_CHECK_DIALOG =
  'aircraftSettings/OPEN_DELETE_CHECK_DIALOG'
export const CLOSE_DELETE_CHECK_DIALOG =
  'aircraftSettings/CLOSE_DELETE_CHECK_DIALOG'
export const DELETE_CHECK = 'aircraftSettings/DELETE_CHECK'
export const SET_DELETE_CHECK_DIALOG_SUBMITTING =
  'aircraftSettings/SET_DELETE_CHECK_DIALOG_SUBMITTING'
export const OPEN_DELETE_FUEL_TYPE_DIALOG =
  'aircraftSettings/OPEN_DELETE_FUEL_TYPE_DIALOG'
export const CLOSE_DELETE_FUEL_TYPE_DIALOG =
  'aircraftSettings/CLOSE_DELETE_FUEL_TYPE_DIALOG'
export const DELETE_FUEL_TYPE = 'aircraftSettings/DELETE_FUEL_TYPE'
export const UPDATE_SETTING = 'aircraftSettings/UPDATE_SETTING'
export const SET_SETTING_SUBMITTING = 'aircraftSettings/SET_SETTING_SUBMITTING'
export const OPEN_DELETE_AIRCRAFT_DIALOG =
  'aircraftSettings/OPEN_DELETE_AIRCRAFT_DIALOG'
export const CLOSE_DELETE_AIRCRAFT_DIALOG =
  'aircraftSettings/CLOSE_DELETE_AIRCRAFT_DIALOG'
export const SET_DELETE_AIRCRAFT_DIALOG_SUBMITTING =
  'aircraftSettings/SET_DELETE_AIRCRAFT_DIALOG_SUBMITTING'
export const DELETE_AIRCRAFT = 'aircraftSettings/DELETE_AIRCRAFT'

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

export const createFuelTypeSuccess = () => ({
  type: CREATE_FUEL_TYPE_SUCCESS
})

export const createFuelTypeFailure = () => ({
  type: CREATE_FUEL_TYPE_FAILURE
})

export const openDeleteCheckDialog = check => ({
  type: OPEN_DELETE_CHECK_DIALOG,
  payload: {
    check
  }
})

export const closeDeleteCheckDialog = () => ({
  type: CLOSE_DELETE_CHECK_DIALOG
})

export const deleteCheck = (organizationId, aircraftId, checkId) => ({
  type: DELETE_CHECK,
  payload: {
    organizationId,
    aircraftId,
    checkId
  }
})

export const setDeleteCheckDialogSubmitting = () => ({
  type: SET_DELETE_CHECK_DIALOG_SUBMITTING
})

export const openDeleteFuelTypeDialog = fuelType => ({
  type: OPEN_DELETE_FUEL_TYPE_DIALOG,
  payload: {
    fuelType
  }
})

export const closeDeleteFuelTypeDialog = () => ({
  type: CLOSE_DELETE_FUEL_TYPE_DIALOG
})

export const deleteFuelType = (organizationId, aircraftId, fuelType) => ({
  type: DELETE_FUEL_TYPE,
  payload: {
    organizationId,
    aircraftId,
    fuelType
  }
})

export const updateSetting = (organizationId, aircraftId, name, value) => ({
  type: UPDATE_SETTING,
  payload: {
    organizationId,
    aircraftId,
    name,
    value
  }
})

export const setSettingSubmitting = (name, submitting) => ({
  type: SET_SETTING_SUBMITTING,
  payload: {
    name,
    submitting
  }
})

export const openDeleteAircraftDialog = () => ({
  type: OPEN_DELETE_AIRCRAFT_DIALOG
})

export const closeDeleteAircraftDialog = () => ({
  type: CLOSE_DELETE_AIRCRAFT_DIALOG
})

export const setDeleteAircraftDialogSubmitting = () => ({
  type: SET_DELETE_AIRCRAFT_DIALOG_SUBMITTING
})

export const deleteAircraft = (organizationId, aircraftId) => ({
  type: DELETE_AIRCRAFT,
  payload: {
    organizationId,
    aircraftId
  }
})
