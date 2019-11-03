import route from './route'
import InvitePage from './components/InvitePage'
import invite, { sagas as inviteSagas } from './module'
import login, { sagas as loginSagas } from '../../../login/module'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('invite', () => {
        describe('route', () => {
          it('should export the right things', () => {
            expect(route).toEqual({
              container: InvitePage,
              reducers: {
                invite,
                login
              },
              sagas: [inviteSagas, loginSagas]
            })
          })
        })
      })
    })
  })
})
