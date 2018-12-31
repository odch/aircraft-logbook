import {
  fetchFlights,
  setFlightsPage,
  openCreateFlightDialog,
  initCreateFlightDialog,
  closeCreateFlightDialog,
  updateCreateFlightDialogData,
  createFlight,
  openDeleteFlightDialog,
  closeDeleteFlightDialog,
  deleteFlight
} from './actions'
import reducer from './reducer'
import sagas from './sagas'

export {
  fetchFlights,
  setFlightsPage,
  openCreateFlightDialog,
  initCreateFlightDialog,
  closeCreateFlightDialog,
  updateCreateFlightDialogData,
  createFlight,
  openDeleteFlightDialog,
  closeDeleteFlightDialog,
  deleteFlight
}

export { sagas }

export default reducer
