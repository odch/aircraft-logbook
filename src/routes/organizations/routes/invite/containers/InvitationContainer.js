import { compose } from 'redux'
import { connect } from 'react-redux'
import Invitation from '../components/Invitation'
import { fetchInvite, acceptInvite } from '../module'
import { logout } from '../../../../../modules/app'

export const getInvite = state => {
  const invite = state.invite.invite

  if (!invite) {
    return invite
  }

  if (invite.deleted === true) {
    return null
  }

  let accepted = false

  if (invite.user) {
    const auth = state.firebase.auth
    if (auth.isEmpty === false) {
      if (auth.uid === invite.user.id) {
        accepted = true
      } else {
        return null
      }
    }
  }

  return {
    firstname: invite.firstname,
    lastname: invite.lastname,
    accepted
  }
}

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
    invite: getInvite(state),
    acceptInProgress: state.invite.acceptInProgress
  }
}

const mapActionCreators = {
  fetchInvite,
  acceptInvite,
  logout
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(Invitation)
