import { connect } from 'react-redux'
import AccountMenu from '../components/AccountMenu'
import { logout } from '../modules/app'
import { getOrganization } from '../util/getFromState'

const mapStateToProps = (state, ownProps) => ({
  auth: state.firebase.auth,
  open: ownProps.open,
  anchorEl: ownProps.anchorEl,
  onClose: ownProps.onClose,
  organization: state.firebase.profile.selectedOrganization
    ? getOrganization(state, state.firebase.profile.selectedOrganization)
    : null
})

const mapActionCreators = {
  logout
}

export default connect(mapStateToProps, mapActionCreators)(AccountMenu)
