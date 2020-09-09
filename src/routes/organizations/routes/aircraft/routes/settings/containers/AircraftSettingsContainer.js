import { compose } from 'redux'
import { connect } from 'react-redux'
import AircraftSettings from '../components/AircraftSettings'
import {
  getOrganization,
  getAircraft
} from '../../../../../../../util/getFromState'
import { fetchAircrafts } from '../../../../../module'

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
  fetchAircrafts
}

export default compose(connect(mapStateToProps, mapActionCreators))(
  AircraftSettings
)
