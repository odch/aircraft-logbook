import { compose } from 'redux'
import { connect } from 'react-redux'
import OrganizationDetail from '../components/OrganizationDetail'
import getOrganizationFromState from '../../../../../util/getOrganizationFromState'

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId }
    }
  } = ownProps

  return {
    organization: getOrganizationFromState(state, organizationId)
  }
}

const mapActionCreators = {}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(OrganizationDetail)
