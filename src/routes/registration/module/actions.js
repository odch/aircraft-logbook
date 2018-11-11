export const SET_EMAIL = 'registration/SET_EMAIL'
export const SET_PASSWORD = 'registration/SET_PASSWORD'
export const REGISTER = 'registration/REGISTER'
export const REGISTRATION_SUCCESS = 'registration/LOGIN_SUCCESS'
export const REGISTRATION_FAILURE = 'registration/LOGIN_FAILURE'
export const SET_SUBMITTED = 'registration/SET_SUBMITTED'

export const setEmail = email => ({
  type: SET_EMAIL,
  payload: {
    email
  }
})

export const setPassword = password => ({
  type: SET_PASSWORD,
  payload: {
    password
  }
})

export const register = (email, password) => ({
  type: REGISTER,
  payload: {
    email,
    password
  }
})

export const registrationSuccess = () => ({
  type: REGISTRATION_SUCCESS
})

export const registrationFailure = () => ({
  type: REGISTRATION_FAILURE
})

export const setSubmitted = () => ({
  type: SET_SUBMITTED
})
