import { compose } from 'redux'
import { connect } from 'react-redux'
import { loadOrganization } from '../modules/organizations'
import OrganizationDetail from '../components/OrganizationDetail'

const getOrganization = (state, organizationId) => {
  const organizations = state.firestore.data.organizations
  if (organizations) {
    const organization = organizations[organizationId]
    if (organization) {
      return { ...organization, id: organizationId }
    }
    return null // not found
  }
  return undefined // still loading
}

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId }
    }
  } = ownProps

  return {
    organizationId: organizationId,
    organization: getOrganization(state, organizationId)
  }
}

const mapActionCreators = {
  loadOrganization
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(OrganizationDetail)
