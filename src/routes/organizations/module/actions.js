export const OPEN_CREATE_ORGANIZATION_DIALOG =
  'organizations/OPEN_CREATE_ORGANIZATION_DIALOG'
export const CLOSE_CREATE_ORGANIZATION_DIALOG =
  'organizations/CLOSE_CREATE_ORGANIZATION_DIALOG'
export const UPDATE_CREATE_ORGANIZATION_DIALOG_DATA =
  'organizations/UPDATE_CREATE_ORGANIZATION_DIALOG_DATA'
export const CREATE_ORGANIZATION = 'organizations/CREATE_ORGANIZATION'
export const CREATE_ORGANIZATION_SUCCESS =
  'organizations/CREATE_ORGANIZATION_SUCCESS'
export const CREATE_ORGANIZATION_FAILURE =
  'organizations/CREATE_ORGANIZATION_FAILURE'
export const SELECT_ORGANIZATION = 'organizations/SELECT_ORGANIZATION'
export const DELETE_ORGANIZATION = 'organizations/DELETE_ORGANIZATION'
export const DELETE_ORGANIZATION_SUCCESS =
  'organizations/DELETE_ORGANIZATION_SUCCESS'
export const DELETE_ORGANIZATION_FAILURE =
  'organizations/DELETE_ORGANIZATION_FAILURE'
export const FETCH_AIRCRAFTS = 'aircrafts/FETCH_AIRCRAFTS'

export const openCreateOrganizationDialog = () => ({
  type: OPEN_CREATE_ORGANIZATION_DIALOG
})

export const closeCreateOrganizationDialog = () => ({
  type: CLOSE_CREATE_ORGANIZATION_DIALOG
})

export const updateCreateOrganizationDialogData = data => ({
  type: UPDATE_CREATE_ORGANIZATION_DIALOG_DATA,
  payload: {
    data
  }
})

export const createOrganization = data => ({
  type: CREATE_ORGANIZATION,
  payload: {
    data
  }
})

export const createOrganizationSuccess = () => ({
  type: CREATE_ORGANIZATION_SUCCESS
})

export const createOrganizationFailure = () => ({
  type: CREATE_ORGANIZATION_FAILURE
})

export const selectOrganization = id => ({
  type: SELECT_ORGANIZATION,
  payload: {
    id
  }
})

export const deleteOrganization = id => ({
  type: DELETE_ORGANIZATION,
  payload: {
    id
  }
})

export const deleteOrganizationSuccess = () => ({
  type: DELETE_ORGANIZATION_SUCCESS
})

export const deleteOrganizationFailure = () => ({
  type: DELETE_ORGANIZATION_FAILURE
})

export const fetchAircrafts = organizationId => ({
  type: FETCH_AIRCRAFTS,
  payload: {
    organizationId
  }
})
