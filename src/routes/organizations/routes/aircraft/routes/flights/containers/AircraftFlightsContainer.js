import { compose } from 'redux'
import { connect } from 'react-redux'
import AircraftFlights from '../components/AircraftFlights'
import {
  getOrganization,
  getAircraft
} from '../../../../../../../util/getFromState'
import {
  fetchAircrafts,
  fetchMembers,
  fetchAerodromes
} from '../../../../../module'

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId, aircraftId }
    }
  } = ownProps

  const organization = getOrganization(state, organizationId)
  const aircraft = getAircraft(state, aircraftId)

  return {
    organization,
    aircraft
  }
}

const mapActionCreators = {
  fetchAircrafts,
  fetchMembers,
  fetchAerodromes
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(AircraftFlights)
