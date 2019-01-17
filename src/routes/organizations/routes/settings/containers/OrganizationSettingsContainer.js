import { compose } from 'redux'
import { connect } from 'react-redux'
import { deleteOrganization, fetchMembers } from '../../../module'
import OrganizationSettings from '../components/OrganizationSettings'
import { getOrganization } from '../../../../../util/getFromState'

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId }
    }
  } = ownProps

  return {
    organization: getOrganization(state, organizationId),
    members: state.firestore.ordered.organizationMembers
  }
}

const mapActionCreators = {
  deleteOrganization,
  fetchMembers
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(OrganizationSettings)
