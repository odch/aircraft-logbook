import { compose } from 'redux'
import { connect } from 'react-redux'
import FlightList from '../../../components/FlightList'
import {
  getAircraftFlights,
  getAircraftFlightsCount
} from '../../../../../../../util/getFromState'
import {
  initFlightsList,
  changeFlightsPage,
  openCreateFlightDialog,
  initCreateFlightDialog,
  openEditFlightDialog,
  openDeleteFlightDialog,
  closeDeleteFlightDialog,
  deleteFlight,
  openCreateCorrectionFlightDialog
} from '../../../module'

const mapStateToProps = (state, ownProps) => {
  const { organization, aircraft } = ownProps

  const showDeleted = state.aircraft.flights.showDeleted

  const flights = getAircraftFlights(
    state,
    aircraft.id,
    state.aircraft.flights.page,
    showDeleted
  )

  const pagination = aircraft
    ? {
        rowsCount: getAircraftFlightsCount(state, aircraft.id, showDeleted),
        page: state.aircraft.flights.page,
        rowsPerPage: state.aircraft.flights.rowsPerPage
      }
    : undefined

  return {
    organization,
    aircraft,
    flights,
    pagination,
    createFlightDialogOpen: state.aircraft.createFlightDialog.open,
    createCorrectionFlightDialogOpen:
      state.aircraft.createCorrectionFlightDialog.open,
    flightDeleteDialog: state.aircraft.deleteFlightDialog,
    showDeleted
  }
}

const mapActionCreators = {
  initFlightsList,
  changeFlightsPage,
  openCreateFlightDialog,
  initCreateFlightDialog,
  openCreateCorrectionFlightDialog,
  openEditFlightDialog,
  openDeleteFlightDialog,
  closeDeleteFlightDialog,
  deleteFlight
}

export default compose(connect(mapStateToProps, mapActionCreators))(FlightList)
