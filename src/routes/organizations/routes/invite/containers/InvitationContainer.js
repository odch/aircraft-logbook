import { compose } from 'redux'
import { connect } from 'react-redux'
import Invitation from '../components/Invitation'
import { fetchInvite, acceptInvite } from '../module'
import { logout } from '../../../../../modules/app'

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { organizationId, inviteId }
    }
  } = ownProps

  return {
    organizationId: organizationId,
    inviteId: inviteId,
    auth: state.firebase.auth,
    invite: state.invite.invite,
    acceptInProgress: state.invite.acceptInProgress
  }
}

const mapActionCreators = {
  fetchInvite,
  acceptInvite,
  logout
}

export default compose(connect(mapStateToProps, mapActionCreators))(Invitation)
