export const FETCH_ORGANIZATIONS = 'app/FETCH_ORGANIZATIONS'
export const SET_MY_ORGANIZATIONS = 'app/SET_MY_ORGANIZATIONS'
export const LOGOUT = 'app/LOGOUT'
export const WATCH_AERODROMES = 'app/WATCH_AERODROMES'

export const fetchOrganizations = () => ({
  type: FETCH_ORGANIZATIONS
})

export const setMyOrganizations = organizations => ({
  type: SET_MY_ORGANIZATIONS,
  payload: {
    organizations
  }
})

export const logout = () => ({
  type: LOGOUT
})

export const watchAerodromes = () => ({
  type: WATCH_AERODROMES
})
