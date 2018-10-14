import { compose } from 'redux'
import { connect } from 'react-redux'
import OrganizationsList from '../components/OrganizationsList'
import { loadOrganizations } from '../modules/organizations'

const mapStateToProps = (state /*, ownProps*/) => ({
  organizations: state.firestore.ordered.organizations
})

const mapActionCreators = {
  loadOrganizations
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(OrganizationsList)
