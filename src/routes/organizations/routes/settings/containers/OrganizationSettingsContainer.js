import { compose } from 'redux'
import { connect } from 'react-redux'
import { selectOrganization, deleteOrganization } from '../../../module'
import OrganizationSettings from '../components/OrganizationSettings'
import getOrganizationFromState from '../../../../../util/getOrganizationFromState'

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId }
    }
  } = ownProps

  return {
    organizationId: organizationId,
    organization: getOrganizationFromState(state, organizationId)
  }
}

const mapActionCreators = {
  selectOrganization,
  deleteOrganization
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(OrganizationSettings)
