export const SET_USERNAME = 'login/SET_USERNAME'
export const SET_PASSWORD = 'login/SET_PASSWORD'
export const LOGIN = 'login/LOGIN'
export const LOGIN_SUCCESS = 'login/LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'login/LOGIN_FAILURE'
export const SET_SUBMITTED = 'login/SET_SUBMITTED'
export const LOGOUT = 'login/LOGOUT'

export const setUsername = username => ({
  type: SET_USERNAME,
  payload: {
    username
  }
})

export const setPassword = password => ({
  type: SET_PASSWORD,
  payload: {
    password
  }
})

export const login = (username, password) => ({
  type: LOGIN,
  payload: {
    username,
    password
  }
})

export const loginSuccess = () => ({
  type: LOGIN_SUCCESS
})

export const loginFailure = () => ({
  type: LOGIN_FAILURE
})

export const setSubmitted = () => ({
  type: SET_SUBMITTED
})

export const logout = () => ({
  type: LOGOUT
})
