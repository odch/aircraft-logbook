import { createReducer } from '../../../../../util/reducer'
import * as actions from './actions'

export const INITIAL_STATE = {
  createFlightDialogOpen: false,
  createFlightDialogData: {
    initialized: false,
    date: null,
    pilot: null,
    blockOffTime: null,
    takeOffTime: null,
    landingTime: null,
    blockOnTime: null
  }
}

const openCreateFlightDialog = state => ({
  ...state,
  createFlightDialogOpen: true,
  createFlightDialogData: INITIAL_STATE.createFlightDialogData
})

const updateCreateFlightDialogData = (state, action) => ({
  ...state,
  createFlightDialogData: {
    ...state.createFlightDialogData,
    ...action.payload.data
  }
})

const closeCreateFlightDialog = state => ({
  ...state,
  createFlightDialogOpen: false
})

const ACTION_HANDLERS = {
  [actions.OPEN_CREATE_FLIGHT_DIALOG]: openCreateFlightDialog,
  [actions.CLOSE_CREATE_FLIGHT_DIALOG]: closeCreateFlightDialog,
  [actions.UPDATE_CREATE_FLIGHT_DIALOG_DATA]: updateCreateFlightDialogData,
  [actions.CREATE_FLIGHT_SUCCESS]: closeCreateFlightDialog
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
