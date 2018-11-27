import { compose } from 'redux'
import { connect } from 'react-redux'
import OrganizationDetail from '../components/OrganizationDetail'
import getOrganizationFromState from '../../../../../util/getOrganizationFromState'
import { fetchAircrafts } from '../../../module'

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId }
    }
  } = ownProps

  return {
    organization: getOrganizationFromState(state, organizationId),
    aircrafts: state.firestore.ordered.organizationAircrafts
  }
}

const mapActionCreators = {
  fetchAircrafts
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(OrganizationDetail)
