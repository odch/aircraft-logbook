import { all, takeEvery, call, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import {
  addArrayItem,
  getDoc,
  updateDoc
} from '../../../../../util/firestoreUtils'
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
            it('should set user on invite', () => {
              const orgId = 'my_org'
              const inviteId = 'invite-id'
              const uid = 'user-id'

              const user = {
                id: uid,
                ref: { id: uid }
              }

              const org = {
                id: orgId,
                ref: { id: orgId }
              }

              const action = actions.acceptInvite(orgId, inviteId)

              return expectSaga(sagas.acceptInvite, action)
                .provide([
                  [select(sagas.uidSelector), uid],
                  [call(getDoc, ['users', uid]), user],
                  [
                    call(
                      updateDoc,
                      ['organizations', orgId, 'members', inviteId],
                      {
                        user: user.ref
                      }
                    )
                  ],
                  [call(getDoc, ['organizations', orgId]), org],
                  [call(addArrayItem, ['users', uid], 'organizations', org.ref)]
                ])
                .put(actions.setAcceptInProgress())
                .put(fetchOrganizations())
                .put(actions.fetchInvite(orgId, inviteId))
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
