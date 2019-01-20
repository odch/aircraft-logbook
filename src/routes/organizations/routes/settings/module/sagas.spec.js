import { all, takeEvery, fork, call } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { addDoc } from '../../../../../util/firestoreUtils'
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
                lastname: 'Muster'
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

          describe('default', () => {
            it('should fork all sagas', () => {
              const generator = sagas.default()

              expect(generator.next().value).toEqual(
                all([
                  fork(takeEvery, actions.CREATE_MEMBER, sagas.createMember)
                ])
              )
            })
          })
        })
      })
    })
  })
})
