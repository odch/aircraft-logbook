export const UPDATE_DATA = 'registration/UPDATE_DATA'
export const REGISTER = 'registration/REGISTER'
export const REGISTRATION_SUCCESS = 'registration/LOGIN_SUCCESS'
export const REGISTRATION_FAILURE = 'registration/LOGIN_FAILURE'
export const SET_SUBMITTED = 'registration/SET_SUBMITTED'

export const updateData = data => ({
  type: UPDATE_DATA,
  payload: {
    data
  }
})

export const register = data => ({
  type: REGISTER,
  payload: {
    data
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
