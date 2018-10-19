import { compose } from 'redux'
import { connect } from 'react-redux'
import OrganizationsList from '../components/OrganizationsList'
import {
  watchOrganizations,
  unwatchOrganizations,
  openCreateOrganizationDialog,
  closeCreateOrganizationDialog,
  updateCreateOrganizationDialogData,
  createOrganization
} from '../modules/organizations'

const mapStateToProps = (state /*, ownProps*/) => ({
  organizations: state.firestore.ordered.organizations,
  createDialogOpen: state.app.organizations.createDialogOpen,
  createDialogData: state.app.organizations.createDialogData
})

const mapActionCreators = {
  watchOrganizations,
  unwatchOrganizations,
  openCreateOrganizationDialog,
  closeCreateOrganizationDialog,
  updateCreateOrganizationDialogData,
  createOrganization
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(OrganizationsList)
