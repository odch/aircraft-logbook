import { compose } from 'redux'
import { connect } from 'react-redux'
import AircraftDetail from '../components/AircraftDetail'
import {
  getOrganization,
  getAircraft,
  getAircraftChecks
} from '../../../../../util/getFromState'
import { fetchAircrafts, fetchMembers, fetchAerodromes } from '../../../module'
import { fetchChecks } from '../module'

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId, aircraftId }
    }
  } = ownProps

  const organization = getOrganization(state, organizationId)
  const aircraft = getAircraft(state, aircraftId)
  const checks = getAircraftChecks(state, aircraftId)

  return {
    organization,
    aircraft,
    checks
  }
}

const mapActionCreators = {
  fetchAircrafts,
  fetchMembers,
  fetchAerodromes,
  fetchChecks
}

export default compose(connect(mapStateToProps, mapActionCreators))(
  AircraftDetail
)
