import { all, takeEvery, call, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { getDoc, updateDoc } from '../../../../../util/firestoreUtils'
import { getFirestore } from '../../../../../util/firebase'
import * as actions from './actions'
import * as sagas from './sagas'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('invite', () => {
        describe('sagas', () => {
          describe('getInvite', () => {
            it('should load invite', () => {
              const orgId = 'my_org'
              const inviteId = 'invite-id'

              const invite = {
                exists: true,
                data: () => ({
                  firstname: 'Max',
                  lastname: 'Muster',
                  deleted: false
                })
              }

              const firestore = {
                get: () => {}
              }

              return expectSaga(sagas.getInvite, orgId, inviteId)
                .provide([
                  [call(getFirestore), firestore],
                  [
                    call(firestore.get, {
                      collection: 'organizations',
                      doc: orgId,
                      subcollections: [
                        {
                          collection: 'members',
                          doc: inviteId
                        }
                      ]
                    }),
                    invite
                  ]
                ])
                .returns(invite)
                .run()
            })
          })

          describe('fetchInvite', () => {
            it('should fetch invite and set to store', () => {
              const orgId = 'my_org'
              const inviteId = 'invite-id'

              const invite = {
                exists: true,
                data: () => ({
                  firstname: 'Max',
                  lastname: 'Muster',
                  deleted: false
                })
              }

              const action = actions.fetchInvite(orgId, inviteId)

              return expectSaga(sagas.fetchInvite, action)
                .provide([[call(sagas.getInvite, orgId, inviteId), invite]])
                .put(actions.setInvite(invite.data()))
                .run()
            })

            it('should fetch invite and set null if does not exist', () => {
              const orgId = 'my_org'
              const inviteId = 'invite-id'

              const invite = {
                exists: false
              }

              const action = actions.fetchInvite(orgId, inviteId)

              return expectSaga(sagas.fetchInvite, action)
                .provide([[call(sagas.getInvite, orgId, inviteId), invite]])
                .put(actions.setInvite(null))
                .run()
            })
          })

          describe('acceptInvite', () => {
            it('should set user on invite', () => {
              const orgId = 'my_org'
              const inviteId = 'invite-id'
              const uid = 'user-id'

              const user = {
                ref: 'user-id'
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
                  ]
                ])
                .put(actions.setAcceptInProgress())
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
