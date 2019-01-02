import { compose } from 'redux'
import { connect } from 'react-redux'
import AircraftDetail from '../components/AircraftDetail'
import {
  getOrganization,
  getAircraft,
  getAircraftFlights
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

export const FLIGHTS_PER_PAGE = 10

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
        rowsCount: aircraft.counters ? aircraft.counters.flights || 0 : 0,
        page: state.aircraft.flights.page,
        rowsPerPage: FLIGHTS_PER_PAGE
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
