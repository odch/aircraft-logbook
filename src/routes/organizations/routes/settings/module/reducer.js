import _set from 'lodash.set'
import { createReducer } from '../../../../../util/reducer'
import * as actions from './actions'

export const INITIAL_STATE = {
  createMemberDialog: {
    open: false,
    submitting: false,
    data: {
      firstname: '',
      lastname: ''
    }
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

const updateCreateMemberDialogData = (state, action) => {
  const newData = {
    ...state.createMemberDialog.data
  }

  Object.keys(action.payload.data).forEach(key => {
    const value = action.payload.data[key]
    _set(newData, key, value)
  })

  return {
    ...state,
    createMemberDialog: {
      ...state.createMemberDialog,
      data: newData
    }
  }
}

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

const ACTION_HANDLERS = {
  [actions.OPEN_CREATE_MEMBER_DIALOG]: openCreateMemberDialog,
  [actions.CLOSE_CREATE_MEMBER_DIALOG]: closeCreateMemberDialog,
  [actions.UPDATE_CREATE_MEMBER_DIALOG_DATA]: updateCreateMemberDialogData,
  [actions.SET_CREATE_MEMBER_DIALOG_SUBMITTING]: setCreateMemberDialogSubmitting,
  [actions.CREATE_MEMBER_SUCCESS]: closeCreateMemberDialog,
  [actions.CREATE_MEMBER_FAILURE]: unsetCreateMemberDialogSubmitting
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
