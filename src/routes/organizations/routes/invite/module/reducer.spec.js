import * as actions from './actions'
import reducer from './reducer'

export const INITIAL_STATE = {
  invite: undefined,
  acceptInProgress: false
}

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('invite', () => {
        describe('reducer', () => {
          it('defines an initial state', () => {
            expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
          })

          it('handles SET_INVITE action', () => {
            expect(
              reducer(
                {
                  invite: {
                    firstname: 'Max',
                    lastname: 'Muster'
                  },
                  acceptInProgress: true
                },
                actions.setInvite({
                  firstname: 'Hans',
                  lastname: 'Meier'
                })
              )
            ).toEqual({
              invite: {
                firstname: 'Hans',
                lastname: 'Meier'
              },
              acceptInProgress: false
            })
          })

          it('handles SET_ACCEPT_IN_PROGRESS action', () => {
            expect(
              reducer(
                {
                  invite: {
                    firstname: 'Max',
                    lastname: 'Muster'
                  },
                  acceptInProgress: false
                },
                actions.setAcceptInProgress()
              )
            ).toEqual({
              invite: {
                firstname: 'Max',
                lastname: 'Muster'
              },
              acceptInProgress: true
            })
          })
        })
      })
    })
  })
})
