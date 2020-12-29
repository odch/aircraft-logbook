import { compose } from 'redux'
import { connect } from 'react-redux'
import FlightList from '../components/FlightList'
import {
  getAircraftFlights,
  getAircraftFlightsCount
} from '../../../../../util/getFromState'
import {
  initFlightsList,
  fetchFlights,
  openCreateFlightDialog,
  initCreateFlightDialog,
  openCreateCorrectionFlightDialog,
  openEditFlightDialog,
  openDeleteFlightDialog,
  closeDeleteFlightDialog,
  deleteFlight
} from '../module'

const mapStateToProps = (state, ownProps) => {
  const { organization, aircraft } = ownProps

  const flights = getAircraftFlights(state, aircraft.id, 0)

  const pagination = aircraft
    ? {
        rowsCount: getAircraftFlightsCount(state, aircraft.id),
        page: state.aircraft.flights.page,
        rowsPerPage: state.aircraft.flights.rowsPerPage
      }
    : undefined

  return {
    organization,
    aircraft,
    flights,
    newestFlight: flights && flights.length > 0 ? flights[0] : null,
    pagination,
    createFlightDialogOpen: state.aircraft.createFlightDialog.open,
    createCorrectionFlightDialogOpen:
      state.aircraft.createCorrectionFlightDialog.open,
    flightDeleteDialog: state.aircraft.deleteFlightDialog
  }
}

const mapActionCreators = {
  initFlightsList,
  fetchFlights,
  openCreateFlightDialog,
  initCreateFlightDialog,
  openCreateCorrectionFlightDialog,
  openEditFlightDialog,
  openDeleteFlightDialog,
  closeDeleteFlightDialog,
  deleteFlight
}

export default compose(connect(mapStateToProps, mapActionCreators))(FlightList)
