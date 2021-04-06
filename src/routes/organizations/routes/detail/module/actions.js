export const OPEN_CREATE_AIRCRAFT_DIALOG =
  'organizationDetail/OPEN_CREATE_AIRCRAFT_DIALOG'
export const CLOSE_CREATE_AIRCRAFT_DIALOG =
  'organizationDetail/CLOSE_CREATE_AIRCRAFT_DIALOG'
export const UPDATE_CREATE_AIRCRAFT_DIALOG_DATA =
  'organizationDetail/UPDATE_CREATE_AIRCRAFT_DIALOG_DATA'
export const CREATE_AIRCRAFT = 'organizations/CREATE_AIRCRAFT'
export const CREATE_AIRCRAFT_SUCCESS =
  'organizationDetail/CREATE_AIRCRAFT_SUCCESS'
export const CREATE_AIRCRAFT_FAILURE =
  'organizationDetail/CREATE_AIRCRAFT_FAILURE'
export const SET_CREATE_AIRCRAFT_DUPLICATE =
  'organizationDetail/SET_CREATE_AIRCRAFT_DUPLICATE'

export const openCreateAircraftDialog = () => ({
  type: OPEN_CREATE_AIRCRAFT_DIALOG
})

export const closeCreateAircraftDialog = () => ({
  type: CLOSE_CREATE_AIRCRAFT_DIALOG
})

export const updateCreateAircraftDialogData = data => ({
  type: UPDATE_CREATE_AIRCRAFT_DIALOG_DATA,
  payload: {
    data
  }
})

export const createAircraft = (organizationId, data) => ({
  type: CREATE_AIRCRAFT,
  payload: {
    organizationId,
    data
  }
})

export const createAircraftSuccess = () => ({
  type: CREATE_AIRCRAFT_SUCCESS
})

export const createAircraftFailure = () => ({
  type: CREATE_AIRCRAFT_FAILURE
})

export const setCreateAircraftDuplicate = () => ({
  type: SET_CREATE_AIRCRAFT_DUPLICATE
})
