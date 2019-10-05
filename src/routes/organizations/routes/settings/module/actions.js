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
export const DELETE_MEMBER = 'organizationSettings/DELETE_MEMBER'
export const SET_MEMBERS_PAGE = 'organizationSettings/SET_MEMBERS_PAGE'
export const EXPORT_FLIGHTS = 'organizationSettings/EXPORT_FLIGHTS'
export const SET_EXPORT_FLIGHTS_FORM_SUBMITTING =
  'organizationSettings/SET_EXPORT_FLIGHTS_FORM_SUBMITTING'
export const UPDATE_EXPORT_FLIGHTS_FORM_DATA =
  'organizationSettings/UPDATE_EXPORT_FLIGHTS_FORM_DATA'

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

export const setMembersPage = page => ({
  type: SET_MEMBERS_PAGE,
  payload: {
    page
  }
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
