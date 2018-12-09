import * as actions from './actions'
import reducer from './reducer'

const INITIAL_STATE = {
  data: {
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  },
  failed: false,
  submitted: false
}

describe('modules', () => {
  describe('registration', () => {
    describe('reducer', () => {
      it('defines an initial state', () => {
        expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
      })

      it('handles UPDATE_DATA action', () => {
        expect(
          reducer(
            {
              data: {
                firstname: 'Max'
              },
              failed: true
            },
            actions.updateData({
              email: 'test@example.com'
            })
          )
        ).toEqual({
          data: {
            firstname: 'Max',
            email: 'test@example.com'
          },
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
