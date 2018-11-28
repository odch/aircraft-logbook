import { compose } from 'redux'
import { connect } from 'react-redux'
import AircraftDetail from '../components/AircraftDetail'
import {
  getOrganization,
  getAircraft,
  getAircraftFlights
} from '../../../../../util/getFromState'
import { fetchAircrafts } from '../../../module'
import { fetchFlights } from '../module'

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId, aircraftId }
    }
  } = ownProps

  return {
    organization: getOrganization(state, organizationId),
    aircraft: getAircraft(state, aircraftId),
    flights: getAircraftFlights(state, aircraftId)
  }
}

const mapActionCreators = {
  fetchAircrafts,
  fetchFlights
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(AircraftDetail)
