import { all, takeEvery, fork, call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { addDoc, updateDoc } from '../../../../../util/firestoreUtils'
import * as actions from './actions'
import * as sagas from './sagas'
import { fetchMembers } from '../../../module'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('sagas', () => {
          describe('createMember', () => {
            it('should add a member to the organization', () => {
              const orgId = 'my_org'
              const memberData = {
                firstname: 'Max',
                lastname: 'Muster',
                deleted: false
              }

              const action = actions.createMember(orgId, memberData)

              return expectSaga(sagas.createMember, action)
                .provide([
                  [
                    call(
                      addDoc,
                      ['organizations', orgId, 'members'],
                      memberData
                    )
                  ]
                ])
                .put(actions.setCreateMemberDialogSubmitting())
                .put(fetchMembers(orgId))
                .put(actions.createMemberSuccess())
                .run()
            })
          })

          describe('deleteMember', () => {
            it('should set the deleted flag on the member', () => {
              const orgId = 'my_org'
              const memberId = 'my_member'

              const action = actions.deleteMember(orgId, memberId)

              return expectSaga(sagas.deleteMember, action)
                .provide([
                  [
                    call(
                      updateDoc,
                      ['organizations', orgId, 'members', memberId],
                      {
                        deleted: true
                      }
                    )
                  ]
                ])
                .put(fetchMembers(orgId))
                .put(actions.closeDeleteMemberDialog())
                .run()
            })
          })

          describe('default', () => {
            it('should fork all sagas', () => {
              const generator = sagas.default()

              expect(generator.next().value).toEqual(
                all([
                  fork(takeEvery, actions.CREATE_MEMBER, sagas.createMember),
                  fork(takeEvery, actions.DELETE_MEMBER, sagas.deleteMember)
                ])
              )
            })
          })
        })
      })
    })
  })
})
