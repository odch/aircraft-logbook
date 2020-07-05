export const INIT_FLIGHTS_LIST = 'aircraft/INIT_FLIGHTS_LIST'
export const FETCH_FLIGHTS = 'aircraft/FETCH_FLIGHTS'
export const CHANGE_FLIGHTS_PAGE = 'aircraft/CHANGE_FLIGHTS_PAGE'
export const SET_FLIGHTS_PAGE = 'aircraft/SET_FLIGHTS_PAGE'
export const SET_FLIGHTS_PARAMS = 'aircraft/SET_FLIGHTS_PARAMS'

export const OPEN_CREATE_FLIGHT_DIALOG = 'aircraft/OPEN_CREATE_FLIGHT_DIALOG'
export const CLOSE_CREATE_FLIGHT_DIALOG = 'aircraft/CLOSE_CREATE_FLIGHT_DIALOG'
export const UPDATE_CREATE_FLIGHT_DIALOG_DATA =
  'aircraft/UPDATE_CREATE_FLIGHT_DIALOG_DATA'
export const CREATE_FLIGHT = 'aircraft/CREATE_FLIGHT'
export const SET_CREATE_FLIGHT_DIALOG_SUBMITTING =
  'aircraft/SET_CREATE_FLIGHT_DIALOG_SUBMITTING'
export const SET_FLIGHT_VALIDATION_ERRORS =
  'aircraft/SET_FLIGHT_VALIDATION_ERRORS'
export const CREATE_FLIGHT_SUCCESS = 'aircraft/CREATE_FLIGHT_SUCCESS'
export const CREATE_FLIGHT_FAILURE = 'aircraft/CREATE_FLIGHT_FAILURE'
export const INIT_CREATE_FLIGHT_DIALOG = 'aircraft/INIT_CREATE_FLIGHT_DIALOG'
export const SET_INITIAL_CREATE_FLIGHT_DIALOG_DATA =
  'aircraft/SET_INITIAL_CREATE_FLIGHT_DIALOG_DATA'
export const OPEN_DELETE_FLIGHT_DIALOG = 'aircraft/OPEN_DELETE_FLIGHT_DIALOG'
export const CLOSE_DELETE_FLIGHT_DIALOG = 'aircraft/CLOSE_DELETE_FLIGHT_DIALOG'
export const DELETE_FLIGHT = 'aircraft/DELETE_FLIGHT'

export const OPEN_CREATE_AERODROME_DIALOG =
  'aircraft/OPEN_CREATE_AERODROME_DIALOG'
export const CLOSE_CREATE_AERODROME_DIALOG =
  'aircraft/CLOSE_CREATE_AERODROME_DIALOG'
export const UPDATE_CREATE_AERODROME_DIALOG_DATA =
  'aircraft/UPDATE_CREATE_AERODROME_DIALOG_DATA'
export const CREATE_AERODROME = 'aircraft/CREATE_AERODROME'
export const SET_CREATE_AERODROME_DIALOG_SUBMITTING =
  'aircraft/SET_CREATE_AERODROME_DIALOG_SUBMITTING'
export const CREATE_AERODROME_SUCCESS = 'aircraft/CREATE_AERODROME_SUCCESS'
export const CREATE_AERODROME_FAILURE = 'aircraft/CREATE_AERODROME_FAILURE'

export const INIT_TECHLOG = 'aircraft/INIT_TECHLOG'
export const FETCH_TECHLOG = 'aircraft/FETCH_TECHLOG'
export const CHANGE_TECHLOG_PAGE = 'aircraft/CHANGE_TECHLOG_PAGE'
export const SET_TECHLOG_PAGE = 'aircraft/SET_TECHLOG_PAGE'
export const SET_TECHLOG_PARAMS = 'aircraft/SET_TECHLOG_PARAMS'

export const OPEN_CREATE_TECHLOG_ENTRY_DIALOG =
  'aircraft/OPEN_CREATE_TECHLOG_ENTRY_DIALOG'
export const CLOSE_CREATE_TECHLOG_ENTRY_DIALOG =
  'aircraft/CLOSE_CREATE_TECHLOG_ENTRY_DIALOG'
export const UPDATE_CREATE_TECHLOG_ENTRY_DIALOG_DATA =
  'aircraft/UPDATE_CREATE_TECHLOG_ENTRY_DIALOG_DATA'
export const CREATE_TECHLOG_ENTRY = 'aircraft/CREATE_TECHLOG_ENTRY'
export const SET_CREATE_TECHLOG_ENTRY_DIALOG_SUBMITTING =
  'aircraft/SET_CREATE_TECHLOG_ENTRY_DIALOG_SUBMITTING'
export const CREATE_TECHLOG_ENTRY_SUCCESS =
  'aircraft/CREATE_TECHLOG_ENTRY_SUCCESS'
export const CREATE_TECHLOG_ENTRY_FAILURE =
  'aircraft/CREATE_TECHLOG_ENTRY_FAILURE'

export const OPEN_CREATE_TECHLOG_ENTRY_ACTION_DIALOG =
  'aircraft/OPEN_CREATE_TECHLOG_ACTION_DIALOG'
export const CLOSE_CREATE_TECHLOG_ENTRY_ACTION_DIALOG =
  'aircraft/CLOSE_CREATE_TECHLOG_ACTION_DIALOG'
export const UPDATE_CREATE_TECHLOG_ENTRY_ACTION_DIALOG_DATA =
  'aircraft/UPDATE_CREATE_TECHLOG_ENTRY_ACTION_DIALOG_DATA'
export const CREATE_TECHLOG_ENTRY_ACTION =
  'aircraft/CREATE_TECHLOG_ENTRY_ACTION'
export const SET_CREATE_TECHLOG_ENTRY_ACTION_DIALOG_SUBMITTING =
  'aircraft/SET_CREATE_TECHLOG_ENTRY_ACTION_DIALOG_SUBMITTING'
export const CREATE_TECHLOG_ENTRY_ACTION_SUCCESS =
  'aircraft/CREATE_TECHLOG_ENTRY_ACTION_SUCCESS'
export const CREATE_TECHLOG_ENTRY_ACTION_FAILURE =
  'aircraft/CREATE_TECHLOG_ENTRY_ACTION_FAILURE'

export const initFlightsList = (organizationId, aircraftId, rowsPerPage) => ({
  type: INIT_FLIGHTS_LIST,
  payload: {
    organizationId,
    aircraftId,
    rowsPerPage
  }
})

export const fetchFlights = () => ({
  type: FETCH_FLIGHTS
})

export const changeFlightsPage = page => ({
  type: CHANGE_FLIGHTS_PAGE,
  payload: {
    page
  }
})

export const setFlightsPage = page => ({
  type: SET_FLIGHTS_PAGE,
  payload: {
    page
  }
})

export const setFlightsParams = (organizationId, aircraftId, rowsPerPage) => ({
  type: SET_FLIGHTS_PARAMS,
  payload: {
    organizationId,
    aircraftId,
    rowsPerPage
  }
})

export const openCreateFlightDialog = () => ({
  type: OPEN_CREATE_FLIGHT_DIALOG
})

export const closeCreateFlightDialog = () => ({
  type: CLOSE_CREATE_FLIGHT_DIALOG
})

export const setInitialCreateFlightDialogData = data => ({
  type: SET_INITIAL_CREATE_FLIGHT_DIALOG_DATA,
  payload: {
    data
  }
})

export const updateCreateFlightDialogData = data => ({
  type: UPDATE_CREATE_FLIGHT_DIALOG_DATA,
  payload: {
    data
  }
})

export const createFlight = (organizationId, aircraftId, data) => ({
  type: CREATE_FLIGHT,
  payload: {
    organizationId,
    aircraftId,
    data
  }
})

export const setCreateFlightDialogSubmitting = () => ({
  type: SET_CREATE_FLIGHT_DIALOG_SUBMITTING
})

export const setFlightValidationErrors = validationErrors => ({
  type: SET_FLIGHT_VALIDATION_ERRORS,
  payload: {
    validationErrors
  }
})

export const createFlightSuccess = () => ({
  type: CREATE_FLIGHT_SUCCESS
})

export const createFlightFailure = () => ({
  type: CREATE_FLIGHT_FAILURE
})

export const initCreateFlightDialog = (organizationId, aircraftId) => ({
  type: INIT_CREATE_FLIGHT_DIALOG,
  payload: {
    organizationId,
    aircraftId
  }
})

export const openDeleteFlightDialog = flight => ({
  type: OPEN_DELETE_FLIGHT_DIALOG,
  payload: {
    flight
  }
})

export const closeDeleteFlightDialog = () => ({
  type: CLOSE_DELETE_FLIGHT_DIALOG
})

export const deleteFlight = (organizationId, aircraftId, flightId) => ({
  type: DELETE_FLIGHT,
  payload: {
    organizationId,
    aircraftId,
    flightId
  }
})

export const openCreateAerodromeDialog = fieldName => ({
  type: OPEN_CREATE_AERODROME_DIALOG,
  payload: {
    fieldName
  }
})

export const closeCreateAerodromeDialog = () => ({
  type: CLOSE_CREATE_AERODROME_DIALOG
})

export const updateCreateAerodromeDialogData = data => ({
  type: UPDATE_CREATE_AERODROME_DIALOG_DATA,
  payload: {
    data
  }
})

export const createAerodrome = (organizationId, fieldName, data) => ({
  type: CREATE_AERODROME,
  payload: {
    organizationId,
    fieldName,
    data
  }
})

export const setCreateAerodromeDialogSubmitting = () => ({
  type: SET_CREATE_AERODROME_DIALOG_SUBMITTING
})

export const createAeorodromeSuccess = () => ({
  type: CREATE_AERODROME_SUCCESS
})

export const createAeorodromeFailure = () => ({
  type: CREATE_AERODROME_FAILURE
})

export const initTechlog = (organizationId, aircraftId, showOnlyOpen) => ({
  type: INIT_TECHLOG,
  payload: {
    organizationId,
    aircraftId,
    showOnlyOpen
  }
})

export const setTechlogParams = (organizationId, aircraftId, showOnlyOpen) => ({
  type: SET_TECHLOG_PARAMS,
  payload: {
    organizationId,
    aircraftId,
    showOnlyOpen
  }
})

export const fetchTechlog = () => ({
  type: FETCH_TECHLOG
})

export const changeTechlogPage = page => ({
  type: CHANGE_TECHLOG_PAGE,
  payload: {
    page
  }
})

export const setTechlogPage = page => ({
  type: SET_TECHLOG_PAGE,
  payload: {
    page
  }
})

export const openCreateTechlogEntryDialog = () => ({
  type: OPEN_CREATE_TECHLOG_ENTRY_DIALOG
})

export const updateCreateTechlogEntryDialogData = data => ({
  type: UPDATE_CREATE_TECHLOG_ENTRY_DIALOG_DATA,
  payload: {
    data
  }
})

export const closeCreateTechlogEntryDialog = () => ({
  type: CLOSE_CREATE_TECHLOG_ENTRY_DIALOG
})

export const setCreateTechlogEntryDialogSubmitting = () => ({
  type: SET_CREATE_TECHLOG_ENTRY_DIALOG_SUBMITTING
})

export const createTechlogEntry = (organizationId, aircraftId, data) => ({
  type: CREATE_TECHLOG_ENTRY,
  payload: {
    organizationId,
    aircraftId,
    data
  }
})

export const createTechlogEntrySuccess = () => ({
  type: CREATE_TECHLOG_ENTRY_SUCCESS
})

export const createTechlogEntryFailure = () => ({
  type: CREATE_TECHLOG_ENTRY_FAILURE
})

export const openCreateTechlogEntryActionDialog = (
  techlogEntryId,
  techlogEntryStatus
) => ({
  type: OPEN_CREATE_TECHLOG_ENTRY_ACTION_DIALOG,
  payload: {
    techlogEntryId,
    techlogEntryStatus
  }
})

export const updateCreateTechlogEntryActionDialogData = data => ({
  type: UPDATE_CREATE_TECHLOG_ENTRY_ACTION_DIALOG_DATA,
  payload: {
    data
  }
})

export const closeCreateTechlogEntryActionDialog = () => ({
  type: CLOSE_CREATE_TECHLOG_ENTRY_ACTION_DIALOG
})

export const setCreateTechlogEntryActionDialogSubmitting = () => ({
  type: SET_CREATE_TECHLOG_ENTRY_ACTION_DIALOG_SUBMITTING
})

export const createTechlogEntryAction = (
  organizationId,
  aircraftId,
  techlogEntryId,
  data
) => ({
  type: CREATE_TECHLOG_ENTRY_ACTION,
  payload: {
    organizationId,
    aircraftId,
    techlogEntryId,
    data
  }
})

export const createTechlogEntryActionSuccess = () => ({
  type: CREATE_TECHLOG_ENTRY_ACTION_SUCCESS
})

export const createTechlogEntryActionFailure = () => ({
  type: CREATE_TECHLOG_ENTRY_ACTION_FAILURE
})
