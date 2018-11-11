import { compose } from 'redux'
import { connect } from 'react-redux'
import { selectOrganization } from '../../../module'
import OrganizationDetail from '../components/OrganizationDetail'
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
  selectOrganization
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(OrganizationDetail)
