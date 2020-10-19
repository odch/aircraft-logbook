import { compose } from 'redux'
import { connect } from 'react-redux'
import AircraftDetail from '../components/AircraftDetail'
import {
  getOrganization,
  getAircraft,
  getAircraftChecks,
  getLatestCrs
} from '../../../../../util/getFromState'
import { fetchAircrafts, fetchMembers, fetchAerodromes } from '../../../module'
import { fetchChecks, fetchLatestCrs } from '../module'

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId, aircraftId }
    }
  } = ownProps

  const organization = getOrganization(state, organizationId)
  const aircraft = getAircraft(state, aircraftId)
  const checks = getAircraftChecks(state, aircraftId)
  const latestCrs = getLatestCrs(state, aircraftId)

  return {
    organization,
    aircraft,
    checks,
    latestCrs,
    authToken: state.firebase.auth.stsTokenManager.accessToken
  }
}

const mapActionCreators = {
  fetchAircrafts,
  fetchMembers,
  fetchAerodromes,
  fetchChecks,
  fetchLatestCrs
}

export default compose(connect(mapStateToProps, mapActionCreators))(
  AircraftDetail
)
