import _set from 'lodash.set'
import moment from 'moment-timezone'
import { createReducer } from '../../../../../util/reducer'
import * as actions from './actions'

export const INITIAL_STATE = {
  createMemberDialog: {
    open: false,
    submitting: false,
    data: {
      firstname: '',
      lastname: '',
      nr: '',
      inviteEmail: ''
    }
  },
  deleteMemberDialog: {
    open: false,
    submitting: false
  },
  editMemberDialog: {
    open: false,
    submitting: false,
    member: undefined,
    data: {
      firstname: '',
      lastname: '',
      nr: '',
      inviteEmail: '',
      reinvite: false
    }
  },
  exportFlightsForm: {
    submitting: false,
    data: {
      startDate: moment()
        .subtract(1, 'months')
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: moment()
        .subtract(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD')
    }
  },
  members: {
    page: 0
  }
}

const openCreateMemberDialog = state => ({
  ...state,
  createMemberDialog: {
    ...INITIAL_STATE.createMemberDialog,
    open: true,
    submitting: false
  }
})

const mergeData = (initialData, actionData) => {
  const newData = { ...initialData }
  Object.keys(actionData).forEach(key => {
    const value = actionData[key]
    _set(newData, key, value)
  })
  return newData
}

const updateCreateMemberDialogData = (state, action) => ({
  ...state,
  createMemberDialog: {
    ...state.createMemberDialog,
    data: mergeData(state.createMemberDialog.data, action.payload.data)
  }
})

const setCreateMemberDialogSubmitting = state =>
  updateCreateMemberDialogSubmitting(state, true)

const unsetCreateMemberDialogSubmitting = state =>
  updateCreateMemberDialogSubmitting(state, false)

const updateCreateMemberDialogSubmitting = (state, submitting) => ({
  ...state,
  createMemberDialog: {
    ...state.createMemberDialog,
    submitting: submitting
  }
})

const closeCreateMemberDialog = state => ({
  ...state,
  createMemberDialog: {
    ...state.createMemberDialog,
    open: false
  }
})

const openDeleteMemberDialog = (state, action) => ({
  ...state,
  deleteMemberDialog: {
    open: true,
    submitting: false,
    member: action.payload.member
  }
})

const closeDeleteMemberDialog = state => ({
  ...state,
  deleteMemberDialog: {
    open: false
  }
})

const setDeleteMemberDialogSubmitting = state => ({
  ...state,
  deleteMemberDialog: {
    ...state.deleteMemberDialog,
    submitting: true
  }
})

const openEditMemberDialog = (state, { payload: { member } }) => ({
  ...state,
  editMemberDialog: {
    ...INITIAL_STATE.editMemberDialog,
    open: true,
    member,
    data: {
      firstname: member.firstname,
      lastname: member.lastname,
      nr: member.nr,
      inviteEmail: member.inviteEmail
    }
  }
})

const updateEditMemberDialogData = (state, action) => ({
  ...state,
  editMemberDialog: {
    ...state.editMemberDialog,
    data: mergeData(state.editMemberDialog.data, action.payload.data)
  }
})

const closeEditMemberDialog = state => ({
  ...state,
  editMemberDialog: INITIAL_STATE.editMemberDialog
})

const setEditMemberDialogSubmitting = state =>
  updateEditMemberDialogSubmitting(state, true)

const unsetEditMemberDialogSubmitting = state =>
  updateEditMemberDialogSubmitting(state, false)

const updateEditMemberDialogSubmitting = (state, submitting) => ({
  ...state,
  editMemberDialog: {
    ...state.editMemberDialog,
    submitting: submitting
  }
})

const setMembersPage = (state, action) => ({
  ...state,
  members: {
    page: action.payload.page
  }
})

const setExportFlightsFormSubmitting = (state, action) => ({
  ...state,
  exportFlightsForm: {
    ...state.exportFlightsForm,
    submitting: action.payload.submitting
  }
})

const updateExportFlightsFormData = (state, action) => {
  const newData = {
    ...state.exportFlightsForm.data
  }

  Object.keys(action.payload.data).forEach(key => {
    const value = action.payload.data[key]
    _set(newData, key, value)
  })

  return {
    ...state,
    exportFlightsForm: {
      ...state.exportFlightsForm,
      data: newData
    }
  }
}

const ACTION_HANDLERS = {
  [actions.OPEN_CREATE_MEMBER_DIALOG]: openCreateMemberDialog,
  [actions.CLOSE_CREATE_MEMBER_DIALOG]: closeCreateMemberDialog,
  [actions.UPDATE_CREATE_MEMBER_DIALOG_DATA]: updateCreateMemberDialogData,
  [actions.SET_CREATE_MEMBER_DIALOG_SUBMITTING]: setCreateMemberDialogSubmitting,
  [actions.CREATE_MEMBER_SUCCESS]: closeCreateMemberDialog,
  [actions.CREATE_MEMBER_FAILURE]: unsetCreateMemberDialogSubmitting,
  [actions.OPEN_DELETE_MEMBER_DIALOG]: openDeleteMemberDialog,
  [actions.CLOSE_DELETE_MEMBER_DIALOG]: closeDeleteMemberDialog,
  [actions.DELETE_MEMBER]: setDeleteMemberDialogSubmitting,
  [actions.OPEN_EDIT_MEMBER_DIALOG]: openEditMemberDialog,
  [actions.CLOSE_EDIT_MEMBER_DIALOG]: closeEditMemberDialog,
  [actions.UPDATE_EDIT_MEMBER_DIALOG_DATA]: updateEditMemberDialogData,
  [actions.SET_EDIT_MEMBER_DIALOG_SUBMITTING]: setEditMemberDialogSubmitting,
  [actions.UPDATE_MEMBER_SUCCESS]: closeEditMemberDialog,
  [actions.UPDATE_MEMBER_FAILURE]: unsetEditMemberDialogSubmitting,
  [actions.SET_MEMBERS_PAGE]: setMembersPage,
  [actions.SET_EXPORT_FLIGHTS_FORM_SUBMITTING]: setExportFlightsFormSubmitting,
  [actions.UPDATE_EXPORT_FLIGHTS_FORM_DATA]: updateExportFlightsFormData
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
