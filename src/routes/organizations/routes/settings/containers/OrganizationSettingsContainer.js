import { compose } from 'redux'
import { connect } from 'react-redux'
import { openCreateMemberDialog, exportFlights } from '../module'
import { deleteOrganization } from '../../../module'
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
    createMemberDialogOpen: state.organizationSettings.createMemberDialog.open
  }
}

const mapActionCreators = {
  openCreateMemberDialog,
  exportFlights,
  deleteOrganization
}

export default compose(connect(mapStateToProps, mapActionCreators))(
  OrganizationSettings
)
