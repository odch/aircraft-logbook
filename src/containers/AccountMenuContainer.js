import { connect } from 'react-redux'
import AccountMenu from '../components/AccountMenu'
import { logout } from '../modules/app'
import getOrganizationFromState from '../util/getOrganizationFromState'

const mapStateToProps = (state, ownProps) => ({
  auth: state.firebase.auth,
  open: ownProps.open,
  anchorEl: ownProps.anchorEl,
  onClose: ownProps.onClose,
  selectedOrganizationId: state.firebase.profile.selectedOrganization,
  organization: state.firebase.profile.selectedOrganization
    ? getOrganizationFromState(
        state,
        state.firebase.profile.selectedOrganization
      )
    : null
})

const mapActionCreators = {
  logout
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(AccountMenu)
