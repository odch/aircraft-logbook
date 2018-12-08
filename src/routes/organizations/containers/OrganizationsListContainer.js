import { compose } from 'redux'
import { connect } from 'react-redux'
import OrganizationsList from '../components/OrganizationsList'
import {
  openCreateOrganizationDialog,
  closeCreateOrganizationDialog,
  updateCreateOrganizationDialogData,
  createOrganization
} from '../module'

const mapStateToProps = (state /*, ownProps*/) => ({
  organizations: state.main.app.organizations,
  createDialog: state.organizations.createDialog
})

const mapActionCreators = {
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
