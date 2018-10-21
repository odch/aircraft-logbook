export const OPEN_CREATE_ORGANIZATION_DIALOG =
  'organizations/OPEN_CREATE_ORGANIZATION_DIALOG'
export const CLOSE_CREATE_ORGANIZATION_DIALOG =
  'organizations/CLOSE_CREATE_ORGANIZATION_DIALOG'
export const UPDATE_CREATE_ORGANIZATION_DIALOG_DATA =
  'organizations/UPDATE_CREATE_ORGANIZATION_DIALOG_DATA'
export const WATCH_ORGANIZATIONS = 'organizations/WATCH_ORGANIZATIONS'
export const UNWATCH_ORGANIZATIONS = 'organizations/UNWATCH_ORGANIZATIONS'
export const CREATE_ORGANIZATION = 'organizations/CREATE_ORGANIZATION'
export const CREATE_ORGANIZATION_SUCCESS =
  'organizations/CREATE_ORGANIZATION_SUCCESS'
export const CREATE_ORGANIZATION_FAILURE =
  'organizations/CREATE_ORGANIZATION_FAILURE'
export const LOAD_ORGANIZATION = 'organizations/LOAD_ORGANIZATION'

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

export const watchOrganizations = () => ({
  type: WATCH_ORGANIZATIONS
})

export const unwatchOrganizations = () => ({
  type: UNWATCH_ORGANIZATIONS
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

export const loadOrganization = id => ({
  type: LOAD_ORGANIZATION,
  payload: {
    id
  }
})
