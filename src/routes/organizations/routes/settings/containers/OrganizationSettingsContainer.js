import { compose } from 'redux'
import { connect } from 'react-redux'
import { openCreateMemberDialog } from '../module'
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
    members: state.firestore.ordered.organizationMembers,
    createMemberDialogOpen: state.organizationSettings.createMemberDialog.open
  }
}

const mapActionCreators = {
  openCreateMemberDialog,
  deleteOrganization,
  fetchMembers
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(OrganizationSettings)
