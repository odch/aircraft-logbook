export const OPEN_CREATE_MEMBER_DIALOG =
  'organizationSettings/OPEN_CREATE_FLIGHT_DIALOG'
export const CLOSE_CREATE_MEMBER_DIALOG =
  'organizationSettings/CLOSE_CREATE_MEMBER_DIALOG'
export const UPDATE_CREATE_MEMBER_DIALOG_DATA =
  'organizationSettings/UPDATE_CREATE_MEMBER_DIALOG_DATA'
export const CREATE_MEMBER = 'organizationSettings/CREATE_MEMBER'
export const SET_CREATE_MEMBER_DIALOG_SUBMITTING =
  'organizationSettings/SET_CREATE_MEMBER_DIALOG_SUBMITTING'
export const CREATE_MEMBER_SUCCESS =
  'organizationSettings/CREATE_MEMBER_SUCCESS'
export const CREATE_MEMBER_FAILURE =
  'organizationSettings/CREATE_MEMBER_FAILURE'
export const OPEN_DELETE_MEMBER_DIALOG =
  'organizationSettings/OPEN_DELETE_MEMBER_DIALOG'
export const CLOSE_DELETE_MEMBER_DIALOG =
  'organizationSettings/CLOSE_DELETE_MEMBER_DIALOG'
export const OPEN_EDIT_MEMBER_DIALOG =
  'organizationSettings/OPEN_EDIT_MEMBER_DIALOG'
export const CLOSE_EDIT_MEMBER_DIALOG =
  'organizationSettings/CLOSE_EDIT_MEMBER_DIALOG'
export const UPDATE_EDIT_MEMBER_DIALOG_DATA =
  'organizationSettings/UPDATE_EDIT_MEMBER_DIALOG_DATA'
export const UPDATE_MEMBER = 'organizationSettings/UPDATE_MEMBER'
export const SET_EDIT_MEMBER_DIALOG_SUBMITTING =
  'organizationSettings/SET_EDIT_MEMBER_DIALOG_SUBMITTING'
export const UPDATE_MEMBER_SUCCESS =
  'organizationSettings/UPDATE_MEMBER_SUCCESS'
export const UPDATE_MEMBER_FAILURE =
  'organizationSettings/UPDATE_MEMBER_FAILURE'
export const DELETE_MEMBER = 'organizationSettings/DELETE_MEMBER'
export const SET_MEMBERS_PAGE = 'organizationSettings/SET_MEMBERS_PAGE'
export const SET_MEMBERS_FILTER = 'organizationSettings/SET_MEMBERS_FILTER'
export const UPDATE_LOCK_DATE = 'organizationSettings/UPDATE_LOCK_DATE'
export const UPDATE_LOCK_DATE_SUCCESS =
  'organizationSettings/UPDATE_LOCK_DATE_SUCCESS'
export const UPDATE_LOCK_DATE_FAILURE =
  'organizationSettings/UPDATE_LOCK_DATE_FAILURE'
export const EXPORT_FLIGHTS = 'organizationSettings/EXPORT_FLIGHTS'
export const SET_EXPORT_FLIGHTS_FORM_SUBMITTING =
  'organizationSettings/SET_EXPORT_FLIGHTS_FORM_SUBMITTING'
export const UPDATE_EXPORT_FLIGHTS_FORM_DATA =
  'organizationSettings/UPDATE_EXPORT_FLIGHTS_FORM_DATA'
export const SET_READONLY_ACCESS_ENABLED =
  'organizationSettings/SET_READONLY_ACCESS_ENABLED'
export const SET_READONLY_ACCESS_ENABLED_SUCCESS =
  'organizationSettings/SET_READONLY_ACCESS_ENABLED_SUCCESS'
export const SET_READONLY_ACCESS_ENABLED_FAILURE =
  'organizationSettings/SET_READONLY_ACCESS_ENABLED_FAILURE'

export const openCreateMemberDialog = () => ({
  type: OPEN_CREATE_MEMBER_DIALOG
})

export const closeCreateMemberDialog = () => ({
  type: CLOSE_CREATE_MEMBER_DIALOG
})

export const updateCreateMemberDialogData = data => ({
  type: UPDATE_CREATE_MEMBER_DIALOG_DATA,
  payload: {
    data
  }
})

export const createMember = (organizationId, data) => ({
  type: CREATE_MEMBER,
  payload: {
    organizationId,
    data
  }
})

export const setCreateMemberDialogSubmitting = () => ({
  type: SET_CREATE_MEMBER_DIALOG_SUBMITTING
})

export const createMemberSuccess = () => ({
  type: CREATE_MEMBER_SUCCESS
})

export const createMemberFailure = () => ({
  type: CREATE_MEMBER_FAILURE
})

export const openDeleteMemberDialog = member => ({
  type: OPEN_DELETE_MEMBER_DIALOG,
  payload: {
    member
  }
})

export const closeDeleteMemberDialog = () => ({
  type: CLOSE_DELETE_MEMBER_DIALOG
})

export const deleteMember = (organizationId, memberId) => ({
  type: DELETE_MEMBER,
  payload: {
    organizationId,
    memberId
  }
})

export const openEditMemberDialog = member => ({
  type: OPEN_EDIT_MEMBER_DIALOG,
  payload: {
    member
  }
})

export const updateEditMemberDialogData = data => ({
  type: UPDATE_EDIT_MEMBER_DIALOG_DATA,
  payload: {
    data
  }
})

export const closeEditMemberDialog = () => ({
  type: CLOSE_EDIT_MEMBER_DIALOG
})

export const updateMember = (organizationId, memberId, data) => ({
  type: UPDATE_MEMBER,
  payload: {
    organizationId,
    memberId,
    data
  }
})

export const setEditMemberDialogSubmitting = () => ({
  type: SET_EDIT_MEMBER_DIALOG_SUBMITTING
})

export const updateMemberSuccess = () => ({
  type: UPDATE_MEMBER_SUCCESS
})

export const updateMemberFailure = () => ({
  type: UPDATE_MEMBER_FAILURE
})

export const setMembersPage = page => ({
  type: SET_MEMBERS_PAGE,
  payload: {
    page
  }
})

export const setMembersFilter = filter => ({
  type: SET_MEMBERS_FILTER,
  payload: {
    filter
  }
})

export const updateLockDate = (organizationId, date) => ({
  type: UPDATE_LOCK_DATE,
  payload: {
    organizationId,
    date
  }
})

export const updateLockDateSuccess = () => ({
  type: UPDATE_LOCK_DATE_SUCCESS
})

export const updateLockDateFailure = () => ({
  type: UPDATE_LOCK_DATE_FAILURE
})

export const exportFlights = (organizationId, startDate, endDate) => ({
  type: EXPORT_FLIGHTS,
  payload: {
    organizationId,
    startDate,
    endDate
  }
})

export const setExportFlightsDialogSubmitting = submitting => ({
  type: SET_EXPORT_FLIGHTS_FORM_SUBMITTING,
  payload: {
    submitting
  }
})

export const updateExportFlightsFormData = data => ({
  type: UPDATE_EXPORT_FLIGHTS_FORM_DATA,
  payload: {
    data
  }
})

export const setReadonlyAccessEnabled = (organizationId, enabled) => ({
  type: SET_READONLY_ACCESS_ENABLED,
  payload: {
    organizationId,
    enabled
  }
})

export const setReadonlyAccessEnabledSuccess = () => ({
  type: SET_READONLY_ACCESS_ENABLED_SUCCESS
})

export const setReadonlyAccessEnabledFailure = () => ({
  type: SET_READONLY_ACCESS_ENABLED_FAILURE
})
