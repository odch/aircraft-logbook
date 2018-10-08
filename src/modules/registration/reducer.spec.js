import * as actions from './actions'
import reducer from './reducer'

const INITIAL_STATE = {
  email: '',
  password: '',
  failed: false,
  submitted: false
}

describe('modules', () => {
  describe('registration', () => {
    describe('reducer', () => {
      it('defines an initial state', () => {
        expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
      })

      it('handles SET_EMAIL action', () => {
        expect(reducer({}, actions.setEmail('test@example.com'))).toEqual({
          email: 'test@example.com',
          failed: false
        })
      })

      it('handles SET_PASSWORD action', () => {
        expect(reducer({}, actions.setPassword('mypassword'))).toEqual({
          password: 'mypassword',
          failed: false
        })
      })

      it('handles REGISTRATION_SUCCESS action', () => {
        expect(reducer({}, actions.registrationSuccess())).toEqual(
          INITIAL_STATE
        )
      })

      it('handles REGISTRATION_FAILURE action', () => {
        expect(reducer({}, actions.registrationFailure())).toEqual({
          failed: true,
          submitted: false
        })
      })

      it('handles SET_SUBMITTED action', () => {
        expect(reducer({}, actions.setSubmitted())).toEqual({
          submitted: true
        })
      })
    })
  })
})
