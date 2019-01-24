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
export const SET_MEMBERS_PAGE = 'organizationSettings/SET_MEMBERS_PAGE'

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

export const setMembersPage = page => ({
  type: SET_MEMBERS_PAGE,
  payload: {
    page
  }
})
