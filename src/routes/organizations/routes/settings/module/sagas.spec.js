import { all, takeEvery, call, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { addDoc, updateDoc } from '../../../../../util/firestoreUtils'
import * as actions from './actions'
import * as sagas from './sagas'
import { fetchMembers } from '../../../module'
import { getFirestore } from '../../../../../util/firebase'

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

          describe('updateMember', () => {
            it('should update member fields', () => {
              const orgId = 'my_org'
              const memberId = 'my_member'
              const data = {
                firstname: 'Max',
                nr: '43492'
              }

              const firestore = {
                update: () => {}
              }

              const action = actions.updateMember(orgId, memberId, data)

              return expectSaga(sagas.updateMember, action)
                .provide([[call(getFirestore), firestore]])
                .call(
                  updateDoc,
                  ['organizations', orgId, 'members', memberId],
                  data
                )
                .put(actions.setEditMemberDialogSubmitting())
                .put(fetchMembers(orgId))
                .put(actions.updateMemberSuccess())
                .run()
            })

            it('should remove inviteTimestamp if reinvite flag is set', () => {
              const orgId = 'my_org'
              const memberId = 'my_member'
              const data = {
                firstname: 'Max',
                reinvite: true
              }

              const firestore = {
                FieldValue: {
                  delete: () => ({ DELETE_FIELD_VALUE: true })
                },
                update: () => {}
              }

              const action = actions.updateMember(orgId, memberId, data)

              return expectSaga(sagas.updateMember, action)
                .provide([[call(getFirestore), firestore]])
                .call(
                  updateDoc,
                  ['organizations', orgId, 'members', memberId],
                  {
                    firstname: 'Max',
                    inviteTimestamp: { DELETE_FIELD_VALUE: true }
                  }
                )
                .put(actions.setEditMemberDialogSubmitting())
                .put(fetchMembers(orgId))
                .put(actions.updateMemberSuccess())
                .run()
            })

            it('should put UPDATE_MEMBER_FAILURE if update fails', () => {
              const orgId = 'my_org'
              const memberId = 'my_member'
              const data = { firstname: 'Max' }

              const firestore = {
                update: () => {}
              }

              const action = actions.updateMember(orgId, memberId, data)

              return expectSaga(sagas.updateMember, action)
                .provide([
                  [call(getFirestore), firestore],
                  [
                    call(
                      updateDoc,
                      ['organizations', orgId, 'members', memberId],
                      data
                    ),
                    throwError(new Error('update failed'))
                  ]
                ])
                .put(actions.setEditMemberDialogSubmitting())
                .put(actions.updateMemberFailure())
                .run()
            })
          })

          describe('exportFlights', () => {
            it('should download a flights CSV', () => {
              const orgId = 'my_org'
              const startDate = '2019-08-01'
              const endDate = '2019-08-31'

              const action = actions.exportFlights(orgId, startDate, endDate)

              return expectSaga(sagas.exportFlights, action)
                .provide([
                  [select(sagas.tokenSelector), 'testtoken'],
                  [
                    call(
                      sagas.generateExport,
                      orgId,
                      startDate,
                      endDate,
                      'testtoken'
                    )
                  ]
                ])
                .put(actions.setExportFlightsDialogSubmitting(true))
                .put(actions.setExportFlightsDialogSubmitting(false))
                .run()
            })
          })

          describe('default', () => {
            it('should fork all sagas', () => {
              const generator = sagas.default()

              expect(generator.next().value).toEqual(
                all([
                  takeEvery(actions.CREATE_MEMBER, sagas.createMember),
                  takeEvery(actions.DELETE_MEMBER, sagas.deleteMember),
                  takeEvery(actions.UPDATE_MEMBER, sagas.updateMember),
                  takeEvery(actions.EXPORT_FLIGHTS, sagas.exportFlights)
                ])
              )
            })
          })
        })
      })
    })
  })
})
