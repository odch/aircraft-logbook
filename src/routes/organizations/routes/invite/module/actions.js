export const FETCH_INVITE = 'organizationInvite/FETCH_INVITE'
export const SET_INVITE = 'organizationInvite/SET_INVITE'
export const ACCEPT_INVITE = 'organizationInvite/ACCEPT_INVITE'
export const SET_ACCEPT_IN_PROGRESS =
  'organizationInvite/SET_ACCEPT_IN_PROGRESS'

export const fetchInvite = (organizationId, inviteId) => ({
  type: FETCH_INVITE,
  payload: {
    organizationId,
    inviteId
  }
})

export const setInvite = invite => ({
  type: SET_INVITE,
  payload: {
    invite
  }
})

export const acceptInvite = (organizationId, inviteId) => ({
  type: ACCEPT_INVITE,
  payload: {
    organizationId,
    inviteId
  }
})

export const setAcceptInProgress = () => ({
  type: SET_ACCEPT_IN_PROGRESS
})
