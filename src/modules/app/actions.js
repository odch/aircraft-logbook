export const WATCH_ORGANIZATIONS = 'app/WATCH_ORGANIZATIONS'
export const UNWATCH_ORGANIZATIONS = 'app/UNWATCH_ORGANIZATIONS'
export const LOGOUT = 'app/LOGOUT'

export const watchOrganizations = () => ({
  type: WATCH_ORGANIZATIONS
})

export const unwatchOrganizations = () => ({
  type: UNWATCH_ORGANIZATIONS
})

export const logout = () => ({
  type: LOGOUT
})
