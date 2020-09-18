import { all, takeEvery, call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { callFunction } from '../../../../../util/firebase'
import * as actions from './actions'
import * as sagas from './sagas'
import { fetchOrganizations } from '../../../../../modules/app'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('invite', () => {
        describe('sagas', () => {
          describe('fetchInvite', () => {
            it('should fetch invite and set to store', () => {
              const organizationId = 'my_org'
              const inviteId = 'invite-id'

              const invite = {
                accepted: false,
                firstname: 'Max'
              }

              const action = actions.fetchInvite(organizationId, inviteId)

              return expectSaga(sagas.fetchInvite, action)
                .provide([
                  [
                    call(callFunction, 'fetchInvite', {
                      organizationId,
                      inviteId
                    }),
                    { data: invite }
                  ]
                ])
                .put(actions.setInvite(invite))
                .run()
            })
          })

          describe('acceptInvite', () => {
            it('should call acceptInvite function', () => {
              const organizationId = 'my_org'
              const inviteId = 'invite-id'

              const action = actions.acceptInvite(organizationId, inviteId)

              return expectSaga(sagas.acceptInvite, action)
                .provide([
                  [
                    call(callFunction, 'acceptInvite', {
                      organizationId,
                      inviteId
                    })
                  ]
                ])
                .put(actions.setAcceptInProgress())
                .call(callFunction, 'acceptInvite', {
                  organizationId,
                  inviteId
                })
                .put(fetchOrganizations())
                .put(actions.fetchInvite(organizationId, inviteId))
                .run()
            })
          })

          describe('default', () => {
            it('should fork all sagas', () => {
              const generator = sagas.default()

              expect(generator.next().value).toEqual(
                all([
                  takeEvery(actions.FETCH_INVITE, sagas.fetchInvite),
                  takeEvery(actions.ACCEPT_INVITE, sagas.acceptInvite)
                ])
              )
            })
          })
        })
      })
    })
  })
})
