import _set from 'lodash.set'
import _cloneDeep from 'lodash.clonedeep'
import { createReducer } from '../../../../../util/reducer'
import { addHours } from '../../../../../util/dates'
import * as actions from './actions'

export const INITIAL_STATE = {
  createFlightDialog: {
    open: false,
    submitting: false,
    initialData: {},
    data: {
      initialized: false
    }
  },
  deleteFlightDialog: {
    open: false
  },
  flights: {
    page: 0,
    rowsPerPage: 10
  }
}

const setFlightsPage = (state, action) => ({
  ...state,
  flights: {
    ...state.flights,
    page: action.payload.page
  }
})

const openCreateFlightDialog = state => ({
  ...state,
  createFlightDialog: {
    ...INITIAL_STATE.createFlightDialog,
    open: true,
    submitting: false
  }
})

const setInitialCreateFlightDialogData = (state, action) => {
  const newData = {
    ...state.createFlightDialog.data
  }
  Object.keys(action.payload.data).forEach(key => {
    const value = action.payload.data[key]
    _set(newData, key, value)
  })

  const initialData = _cloneDeep(newData)

  newData.initialized = true
  delete initialData.initialized

  return {
    ...state,
    createFlightDialog: {
      ...state.createFlightDialog,
      data: newData,
      initialData
    }
  }
}

export const updateLandingTime = data => {
  if (data.takeOffTime && data.counters && data.counters.flightTimeCounter) {
    const flightTime = data.counters.flightTimeCounter
    if (
      typeof flightTime.start === 'number' &&
      typeof flightTime.end === 'number'
    ) {
      const flightDuration = (flightTime.end - flightTime.start) / 100
      data.landingTime = addHours(data.takeOffTime, flightDuration)
    }
  }
}

const dataModifiers = [updateLandingTime]

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

  dataModifiers.forEach(modifier => modifier(newData))

  return {
    ...state,
    createFlightDialog: {
      ...state.createFlightDialog,
      data: newData,
      validationErrors: newValidationErrors
    }
  }
}

const setCreateFlightDialogSubmitting = state =>
  updateCreateFlightDialogSubmitting(state, true)

const unsetCreateFlightDialogSubmitting = state =>
  updateCreateFlightDialogSubmitting(state, false)

const updateCreateFlightDialogSubmitting = (state, submitting) => ({
  ...state,
  createFlightDialog: {
    ...state.createFlightDialog,
    submitting: submitting
  }
})

const setFlightValidationErrors = (state, action) => ({
  ...state,
  createFlightDialog: {
    ...state.createFlightDialog,
    submitting: false,
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
  [actions.SET_INITIAL_CREATE_FLIGHT_DIALOG_DATA]: setInitialCreateFlightDialogData,
  [actions.UPDATE_CREATE_FLIGHT_DIALOG_DATA]: updateCreateFlightDialogData,
  [actions.SET_CREATE_FLIGHT_DIALOG_SUBMITTING]: setCreateFlightDialogSubmitting,
  [actions.SET_FLIGHT_VALIDATION_ERRORS]: setFlightValidationErrors,
  [actions.CREATE_FLIGHT_SUCCESS]: closeCreateFlightDialog,
  [actions.CREATE_FLIGHT_FAILURE]: unsetCreateFlightDialogSubmitting,
  [actions.OPEN_DELETE_FLIGHT_DIALOG]: openDeleteFlightDialog,
  [actions.CLOSE_DELETE_FLIGHT_DIALOG]: closeDeleteFlightDialog,
  [actions.DELETE_FLIGHT]: setDeleteFlightDialogSubmitted
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
