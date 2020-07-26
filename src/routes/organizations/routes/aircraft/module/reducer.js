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
  createAerodromeDialog: {
    open: false,
    fieldName: null,
    data: {
      identification: '',
      name: '',
      timezone: null
    }
  },
  flights: {
    organizationId: null,
    aircraftId: null,
    page: 0,
    rowsPerPage: 10
  },
  techlog: {
    organizationId: null,
    aircraftId: null,
    page: 0,
    rowsPerPage: 10,
    showOnlyOpen: false
  },
  createTechlogEntryDialog: {
    open: false,
    submitting: false,
    data: {
      description: '',
      status: null,
      attachments: []
    }
  },
  createTechlogEntryActionDialog: {
    open: false,
    submitting: false,
    techlogEntryId: null,
    data: {
      description: '',
      status: null,
      signature: null
    }
  }
}

const setFlightsPage = (state, action) => ({
  ...state,
  flights: {
    ...state.flights,
    page: action.payload.page
  }
})

const setFlightsParams = (state, { payload }) => ({
  ...state,
  flights: {
    organizationId: payload.organizationId,
    aircraftId: payload.aircraftId,
    page: 0,
    rowsPerPage: payload.rowsPerPage
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
  if (
    data.takeOffTime &&
    data.counters &&
    data.counters.flightTimeCounter &&
    data.departureAerodrome &&
    data.departureAerodrome.timezone &&
    data.destinationAerodrome &&
    data.destinationAerodrome.timezone
  ) {
    const flightTime = data.counters.flightTimeCounter
    if (
      typeof flightTime.start === 'number' &&
      typeof flightTime.end === 'number'
    ) {
      const flightDuration = (flightTime.end - flightTime.start) / 100
      data.landingTime = addHours(
        data.takeOffTime,
        flightDuration,
        data.departureAerodrome.timezone,
        data.destinationAerodrome.timezone
      )
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

const openCreateAerodromeDialog = (state, action) => ({
  ...state,
  createAerodromeDialog: {
    open: true,
    fieldName: action.payload.fieldName,
    data: INITIAL_STATE.createAerodromeDialog.data
  }
})

const updateCreateAerodromeDialogData = (state, action) => {
  const newData = {
    ...state.createAerodromeDialog.data
  }

  Object.keys(action.payload.data).forEach(key => {
    const value = action.payload.data[key]
    _set(newData, key, value)
  })

  return {
    ...state,
    createAerodromeDialog: {
      ...state.createAerodromeDialog,
      data: newData
    }
  }
}

const setCreateAerodromeDialogSubmitting = state =>
  updateCreateAerodromeDialogSubmitting(state, true)

const unsetCreateAerodromeDialogSubmitting = state =>
  updateCreateAerodromeDialogSubmitting(state, false)

const updateCreateAerodromeDialogSubmitting = (state, submitting) => ({
  ...state,
  createAerodromeDialog: {
    ...state.createAerodromeDialog,
    submitting: submitting
  }
})

const closeCreateAerodromeDialog = state => ({
  ...state,
  createAerodromeDialog: {
    ...state.createAerodromeDialog,
    open: false
  }
})

const setTechlogPage = (state, action) => ({
  ...state,
  techlog: {
    ...state.techlog,
    page: action.payload.page
  }
})

const setTechlogParams = (state, { payload }) => ({
  ...state,
  techlog: {
    organizationId: payload.organizationId,
    aircraftId: payload.aircraftId,
    page: 0,
    rowsPerPage: payload.showOnlyOpen ? undefined : 10,
    showOnlyOpen: payload.showOnlyOpen
  }
})

const openCreateTechlogEntryDialog = state => ({
  ...state,
  createTechlogEntryDialog: {
    ...INITIAL_STATE.createTechlogEntryDialog,
    open: true
  }
})

const updateCreateTechlogEntryDialogData = (state, action) => {
  const newData = {
    ...state.createTechlogEntryDialog.data
  }

  Object.keys(action.payload.data).forEach(key => {
    const value = action.payload.data[key]
    _set(newData, key, value)
  })

  return {
    ...state,
    createTechlogEntryDialog: {
      ...state.createTechlogEntryDialog,
      data: newData
    }
  }
}

const setCreateTechlogEntryDialogSubmitting = state =>
  updateCreateTechlogEntryDialogSubmitting(state, true)

const unsetCreateTechlogEntryDialogSubmitting = state =>
  updateCreateTechlogEntryDialogSubmitting(state, false)

const updateCreateTechlogEntryDialogSubmitting = (state, submitting) => ({
  ...state,
  createTechlogEntryDialog: {
    ...state.createTechlogEntryDialog,
    submitting: submitting
  }
})

const closeCreateTechlogEntryDialog = state => ({
  ...state,
  createTechlogEntryDialog: {
    ...state.createTechlogEntryDialog,
    open: false
  }
})

const openCreateTechlogEntryActionDialog = (state, { payload }) => ({
  ...state,
  createTechlogEntryActionDialog: {
    ...INITIAL_STATE.createTechlogEntryActionDialog,
    techlogEntryId: payload.techlogEntryId,
    data: {
      ...INITIAL_STATE.createTechlogEntryActionDialog.data,
      status: payload.techlogEntryStatus
    },
    open: true
  }
})

const updateCreateTechlogEntryActionDialogData = (state, action) => {
  const newData = {
    ...state.createTechlogEntryActionDialog.data
  }

  Object.keys(action.payload.data).forEach(key => {
    const value = action.payload.data[key]
    _set(newData, key, value)
  })

  return {
    ...state,
    createTechlogEntryActionDialog: {
      ...state.createTechlogEntryActionDialog,
      data: newData
    }
  }
}

const setCreateTechlogEntryActionDialogSubmitting = state =>
  updateCreateTechlogEntryActionDialogSubmitting(state, true)

const unsetCreateTechlogEntryActionDialogSubmitting = state =>
  updateCreateTechlogEntryActionDialogSubmitting(state, false)

const updateCreateTechlogEntryActionDialogSubmitting = (state, submitting) => ({
  ...state,
  createTechlogEntryActionDialog: {
    ...state.createTechlogEntryActionDialog,
    submitting: submitting
  }
})

const closeCreateTechlogEntryActionDialog = state => ({
  ...state,
  createTechlogEntryActionDialog: {
    ...state.createTechlogEntryActionDialog,
    open: false
  }
})

const ACTION_HANDLERS = {
  [actions.SET_FLIGHTS_PAGE]: setFlightsPage,
  [actions.SET_FLIGHTS_PARAMS]: setFlightsParams,
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
  [actions.DELETE_FLIGHT]: setDeleteFlightDialogSubmitted,
  [actions.OPEN_CREATE_AERODROME_DIALOG]: openCreateAerodromeDialog,
  [actions.CLOSE_CREATE_AERODROME_DIALOG]: closeCreateAerodromeDialog,
  [actions.UPDATE_CREATE_AERODROME_DIALOG_DATA]: updateCreateAerodromeDialogData,
  [actions.SET_CREATE_AERODROME_DIALOG_SUBMITTING]: setCreateAerodromeDialogSubmitting,
  [actions.CREATE_AERODROME_SUCCESS]: closeCreateAerodromeDialog,
  [actions.CREATE_AERODROME_FAILURE]: unsetCreateAerodromeDialogSubmitting,
  [actions.SET_TECHLOG_PAGE]: setTechlogPage,
  [actions.SET_TECHLOG_PARAMS]: setTechlogParams,
  [actions.OPEN_CREATE_TECHLOG_ENTRY_DIALOG]: openCreateTechlogEntryDialog,
  [actions.UPDATE_CREATE_TECHLOG_ENTRY_DIALOG_DATA]: updateCreateTechlogEntryDialogData,
  [actions.SET_CREATE_TECHLOG_ENTRY_DIALOG_SUBMITTING]: setCreateTechlogEntryDialogSubmitting,
  [actions.CREATE_TECHLOG_ENTRY_FAILURE]: unsetCreateTechlogEntryDialogSubmitting,
  [actions.CREATE_TECHLOG_ENTRY_SUCCESS]: closeCreateTechlogEntryDialog,
  [actions.CLOSE_CREATE_TECHLOG_ENTRY_DIALOG]: closeCreateTechlogEntryDialog,
  [actions.OPEN_CREATE_TECHLOG_ENTRY_ACTION_DIALOG]: openCreateTechlogEntryActionDialog,
  [actions.UPDATE_CREATE_TECHLOG_ENTRY_ACTION_DIALOG_DATA]: updateCreateTechlogEntryActionDialogData,
  [actions.SET_CREATE_TECHLOG_ENTRY_ACTION_DIALOG_SUBMITTING]: setCreateTechlogEntryActionDialogSubmitting,
  [actions.CREATE_TECHLOG_ENTRY_ACTION_FAILURE]: unsetCreateTechlogEntryActionDialogSubmitting,
  [actions.CREATE_TECHLOG_ENTRY_ACTION_SUCCESS]: closeCreateTechlogEntryActionDialog,
  [actions.CLOSE_CREATE_TECHLOG_ENTRY_ACTION_DIALOG]: closeCreateTechlogEntryActionDialog
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
