import { all, takeEvery, takeLatest, call, select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import * as actions from './actions'
import * as sagas from './sagas'
import { fetchOrganizations } from '../../../../../modules/app'
import { fetchMembers, fetchAircrafts } from '../../../module'
import { callFunction } from '../../../../../util/firebase'

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
                    call(callFunction, 'addMember', {
                      organizationId: orgId,
                      member: memberData
                    })
                  ]
                ])
                .call(callFunction, 'addMember', {
                  organizationId: orgId,
                  member: memberData
                })
                .put(fetchMembers(orgId))
                .put(actions.createMemberSuccess())
                .run()
            })

            it('should put errors if fails', () => {
              const orgId = 'my_org'
              const memberData = {
                firstname: 'Max',
                lastname: 'Muster'
              }

              const action = actions.createMember(orgId, memberData)

              return expectSaga(sagas.createMember, action)
                .provide([
                  [
                    call(callFunction, 'addMember', {
                      organizationId: orgId,
                      member: memberData
                    }),
                    {
                      data: {
                        error: 'LIMIT_REACHED'
                      }
                    }
                  ]
                ])
                .call(callFunction, 'addMember', {
                  organizationId: orgId,
                  member: memberData
                })
                .put(
                  actions.createMemberFailure({
                    LIMIT_REACHED: true
                  })
                )
                .run()
            })
          })

          describe('deleteMember', () => {
            it('should call deleteMember cloud function', () => {
              const orgId = 'my_org'
              const memberId = 'my_member'

              const action = actions.deleteMember(orgId, memberId)

              return expectSaga(sagas.deleteMember, action)
                .provide([
                  [
                    call(callFunction, 'deleteMember', {
                      organizationId: orgId,
                      memberId
                    })
                  ]
                ])
                .call(callFunction, 'deleteMember', {
                  organizationId: orgId,
                  memberId
                })
                .put(fetchMembers(orgId))
                .put(actions.closeDeleteMemberDialog())
                .run()
            })
          })

          describe('removeUserLink', () => {
            it('should call removeUserLink cloud function', () => {
              const organizationId = 'my_org'
              const memberId = 'my_member'

              const action = actions.removeUserLink(organizationId, memberId)

              return expectSaga(sagas.removeUserLink, action)
                .provide([
                  [
                    call(callFunction, 'removeUserLink', {
                      organizationId,
                      memberId
                    })
                  ]
                ])
                .call(callFunction, 'removeUserLink', {
                  organizationId,
                  memberId
                })
                .put(fetchMembers(organizationId))
                .put(actions.closeRemoveUserLinkDialog())
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

              const action = actions.updateMember(orgId, memberId, data)

              return expectSaga(sagas.updateMember, action)
                .provide([
                  [
                    call(callFunction, 'updateMember', {
                      organizationId: orgId,
                      memberId: memberId,
                      member: data
                    })
                  ]
                ])
                .call(callFunction, 'updateMember', {
                  organizationId: orgId,
                  memberId: memberId,
                  member: data
                })
                .put(fetchMembers(orgId))
                .put(actions.updateMemberSuccess())
                .run()
            })

            it('should put errors if fails', () => {
              const orgId = 'my_org'
              const memberId = 'my_member'
              const data = {
                firstname: 'Max',
                lastname: 'Muster'
              }

              const action = actions.updateMember(orgId, memberId, data)

              return expectSaga(sagas.updateMember, action)
                .provide([
                  [
                    call(callFunction, 'updateMember', {
                      organizationId: orgId,
                      memberId,
                      member: data
                    }),
                    {
                      data: {
                        error: 'LIMIT_REACHED'
                      }
                    }
                  ]
                ])
                .put(
                  actions.updateMemberFailure({
                    LIMIT_REACHED: true
                  })
                )
                .run()
            })

            it('should put UPDATE_MEMBER_FAILURE if update fails', () => {
              const orgId = 'my_org'
              const memberId = 'my_member'
              const data = { firstname: 'Max' }

              const action = actions.updateMember(orgId, memberId, data)

              return expectSaga(sagas.updateMember, action)
                .provide([
                  [
                    call(callFunction, 'updateMember', {
                      organizationId: orgId,
                      memberId: memberId,
                      member: data
                    }),
                    throwError(new Error('update failed'))
                  ]
                ])
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

          describe('updateLockDate', () => {
            it('should update the lock date', () => {
              const organizationId = 'my_org'
              const date = '2020-11-04'

              const action = actions.updateLockDate(organizationId, date)

              return expectSaga(sagas.updateLockDate, action)
                .provide([
                  [
                    call(callFunction, 'updateLockDate', {
                      organizationId,
                      date
                    })
                  ]
                ])
                .call(callFunction, 'updateLockDate', {
                  organizationId,
                  date
                })
                .put(fetchOrganizations())
                .put(fetchAircrafts(organizationId))
                .put(actions.updateLockDateSuccess())
                .run()
            })
          })

          describe('setReadonlyAccessEnabled', () => {
            it('should set readonly access enabled/disabled', () => {
              const organizationId = 'my_org'
              const enabled = true

              const action = actions.setReadonlyAccessEnabled(
                organizationId,
                enabled
              )

              return expectSaga(sagas.setReadonlyAccessEnabled, action)
                .provide([
                  [
                    call(callFunction, 'setReadonlyAccessEnabled', {
                      organizationId,
                      enabled
                    })
                  ]
                ])
                .call(callFunction, 'setReadonlyAccessEnabled', {
                  organizationId,
                  enabled
                })
                .put(fetchOrganizations())
                .put(actions.setReadonlyAccessEnabledSuccess())
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
                  takeEvery(actions.REMOVE_USER_LINK, sagas.removeUserLink),
                  takeEvery(actions.UPDATE_MEMBER, sagas.updateMember),
                  takeEvery(actions.EXPORT_FLIGHTS, sagas.exportFlights),
                  takeLatest(actions.UPDATE_LOCK_DATE, sagas.updateLockDate),
                  takeLatest(
                    actions.SET_READONLY_ACCESS_ENABLED,
                    sagas.setReadonlyAccessEnabled
                  )
                ])
              )
            })
          })
        })
      })
    })
  })
})
