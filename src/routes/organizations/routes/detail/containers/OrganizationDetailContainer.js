import { compose } from 'redux'
import { connect } from 'react-redux'
import OrganizationDetail from '../components/OrganizationDetail'
import { getOrganization, getUserEmail } from '../../../../../util/getFromState'
import { fetchAircrafts } from '../../../module'
import { openCreateAircraftDialog } from '../module'

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId }
    }
  } = ownProps

  return {
    organizationId,
    userEmail: getUserEmail(state),
    organization: getOrganization(state, organizationId),
    aircrafts: state.firestore.ordered.organizationAircrafts,
    createAircraftDialogOpen: state.organizationDetail.createAircraftDialog.open
  }
}

const mapActionCreators = {
  fetchAircrafts,
  openCreateAircraftDialog
}

export default compose(connect(mapStateToProps, mapActionCreators))(
  OrganizationDetail
)
