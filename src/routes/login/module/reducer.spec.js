import * as actions from './actions'
import reducer from './reducer'

const INITIAL_STATE = {
  username: '',
  password: '',
  failed: false,
  submitted: false,
  googleLogin: {
    failed: false
  }
}

describe('modules', () => {
  describe('login', () => {
    describe('reducer', () => {
      it('defines an initial state', () => {
        expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
      })

      it('handles SET_USERNAME action', () => {
        expect(reducer({}, actions.setUsername('myusername'))).toEqual({
          username: 'myusername',
          failed: false
        })
      })

      it('handles SET_PASSWORD action', () => {
        expect(reducer({}, actions.setPassword('mypassword'))).toEqual({
          password: 'mypassword',
          failed: false
        })
      })

      it('handles LOGIN_SUCCESS action', () => {
        expect(reducer({}, actions.loginSuccess())).toEqual(INITIAL_STATE)
      })

      it('handles LOGIN_FAILURE action', () => {
        expect(reducer({}, actions.loginFailure())).toEqual({
          password: '',
          failed: true,
          submitted: false
        })
      })

      it('handles SET_SUBMITTED action', () => {
        expect(reducer({}, actions.setSubmitted())).toEqual({
          submitted: true
        })
      })

      it('handles LOGIN_GOOGLE_FAILURE action', () => {
        expect(
          reducer(
            {
              username: 'foo',
              googleLogin: {
                failed: false
              }
            },
            actions.loginGoogleFailure()
          )
        ).toEqual({
          username: 'foo',
          googleLogin: {
            failed: true
          }
        })
      })
    })
  })
})
