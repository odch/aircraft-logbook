import _set from 'lodash.set'
import { createReducer } from '../../../../../util/reducer'
import * as actions from './actions'

export const INITIAL_STATE = {
  createFlightDialog: {
    open: false,
    data: {
      initialized: false,
      date: null,
      pilot: null,
      blockOffTime: null,
      takeOffTime: null,
      landingTime: null,
      blockOnTime: null,
      counters: {
        flightHours: {
          start: null,
          end: null
        }
      }
    }
  },
  deleteFlightDialog: {
    open: false
  },
  flights: {
    page: 0
  }
}

const setFlightsPage = (state, action) => ({
  ...state,
  flights: {
    page: action.payload.page
  }
})

const openCreateFlightDialog = state => ({
  ...state,
  createFlightDialog: {
    ...INITIAL_STATE.createFlightDialog,
    open: true
  }
})

const updateCreateFlightDialogData = (state, action) => {
  const newData = {
    ...state.createFlightDialog.data
  }
  const newValidationErrors = {
    ...state.createFlightDialog.validationErrors
  }

  Object.keys(action.payload.data).forEach(key => {
    const value = action.payload.data[key]
    _set(newData, key, value)

    delete newValidationErrors[key]
  })

  return {
    ...state,
    createFlightDialog: {
      ...state.createFlightDialog,
      data: newData,
      validationErrors: newValidationErrors
    }
  }
}

const setFlightValidationErrors = (state, action) => ({
  ...state,
  createFlightDialog: {
    ...state.createFlightDialog,
    validationErrors: action.payload.validationErrors
  }
})

const closeCreateFlightDialog = state => ({
  ...state,
  createFlightDialog: {
    ...state.createFlightDialog,
    open: false
  }
})

const openDeleteFlightDialog = (state, action) => ({
  ...state,
  deleteFlightDialog: {
    open: true,
    flight: action.payload.flight
  }
})

const closeDeleteFlightDialog = state => ({
  ...state,
  deleteFlightDialog: {
    open: false
  }
})

const setDeleteFlightDialogSubmitted = state => ({
  ...state,
  deleteFlightDialog: {
    ...state.deleteFlightDialog,
    submitted: true
  }
})

const ACTION_HANDLERS = {
  [actions.SET_FLIGHTS_PAGE]: setFlightsPage,
  [actions.OPEN_CREATE_FLIGHT_DIALOG]: openCreateFlightDialog,
  [actions.CLOSE_CREATE_FLIGHT_DIALOG]: closeCreateFlightDialog,
  [actions.UPDATE_CREATE_FLIGHT_DIALOG_DATA]: updateCreateFlightDialogData,
  [actions.SET_FLIGHT_VALIDATION_ERRORS]: setFlightValidationErrors,
  [actions.CREATE_FLIGHT_SUCCESS]: closeCreateFlightDialog,
  [actions.OPEN_DELETE_FLIGHT_DIALOG]: openDeleteFlightDialog,
  [actions.CLOSE_DELETE_FLIGHT_DIALOG]: closeDeleteFlightDialog,
  [actions.DELETE_FLIGHT]: setDeleteFlightDialogSubmitted
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
