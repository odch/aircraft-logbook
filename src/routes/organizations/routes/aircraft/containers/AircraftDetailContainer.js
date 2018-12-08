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
  openCreateFlightDialog,
  initCreateFlightDialog
} from '../module'

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId, aircraftId }
    }
  } = ownProps

  return {
    organization: getOrganization(state, organizationId),
    aircraft: getAircraft(state, aircraftId),
    flights: getAircraftFlights(state, aircraftId),
    createFlightDialogOpen: state.aircraft.createFlightDialogOpen
  }
}

const mapActionCreators = {
  fetchAircrafts,
  fetchMembers,
  fetchFlights,
  openCreateFlightDialog,
  initCreateFlightDialog
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(AircraftDetail)