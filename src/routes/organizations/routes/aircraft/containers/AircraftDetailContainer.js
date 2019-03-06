import { compose } from 'redux'
import { connect } from 'react-redux'
import AircraftDetail from '../components/AircraftDetail'
import {
  getOrganization,
  getAircraft,
  getAircraftFlights,
  getAircraftFlightsCount
} from '../../../../../util/getFromState'
import { fetchAircrafts, fetchMembers } from '../../../module'
import {
  fetchFlights,
  setFlightsPage,
  openCreateFlightDialog,
  initCreateFlightDialog,
  openDeleteFlightDialog,
  closeDeleteFlightDialog,
  deleteFlight
} from '../module'

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId, aircraftId }
    }
  } = ownProps

  const organization = getOrganization(state, organizationId)
  const aircraft = getAircraft(state, aircraftId)
  const flights = getAircraftFlights(
    state,
    aircraftId,
    state.aircraft.flights.page
  )

  const flightsPagination = aircraft
    ? {
        rowsCount: getAircraftFlightsCount(state, aircraftId),
        page: state.aircraft.flights.page,
        rowsPerPage: state.aircraft.flights.rowsPerPage
      }
    : undefined

  return {
    organization,
    aircraft,
    flights,
    flightsPagination,
    createFlightDialogOpen: state.aircraft.createFlightDialog.open,
    flightDeleteDialog: state.aircraft.deleteFlightDialog
  }
}

const mapActionCreators = {
  fetchAircrafts,
  fetchMembers,
  fetchFlights,
  setFlightsPage,
  openCreateFlightDialog,
  initCreateFlightDialog,
  openDeleteFlightDialog,
  closeDeleteFlightDialog,
  deleteFlight
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(AircraftDetail)
