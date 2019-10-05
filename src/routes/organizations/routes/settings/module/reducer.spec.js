import moment from 'moment-timezone'
import * as actions from './actions'
import reducer from './reducer'

export const INITIAL_STATE = {
  createMemberDialog: {
    open: false,
    submitting: false,
    data: {
      firstname: '',
      lastname: '',
      nr: ''
    }
  },
  deleteMemberDialog: {
    open: false,
    submitting: false
  },
  exportFlightsForm: {
    submitting: false,
    data: {
      startDate: moment()
        .subtract(1, 'months')
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: moment()
        .subtract(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD')
    }
  },
  members: {
    page: 0
  }
}

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('reducer', () => {
          it('defines an initial state', () => {
            expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
          })

          it('handles OPEN_CREATE_MEMBER_DIALOG action', () => {
            expect(
              reducer(
                {
                  createMemberDialog: {
                    open: false,
                    submitting: true,
                    data: {
                      firstname: 'Max',
                      lastname: 'Meier',
                      nr: '34534'
                    }
                  }
                },
                actions.openCreateMemberDialog()
              )
            ).toEqual({
              createMemberDialog: {
                open: true,
                submitting: false,
                data: {
                  firstname: '',
                  lastname: '',
                  nr: ''
                }
              }
            })
          })

          it('handles CLOSE_CREATE_MEMBER_DIALOG action', () => {
            expect(
              reducer(
                {
                  createMemberDialog: {
                    open: true
                  }
                },
                actions.closeCreateMemberDialog()
              )
            ).toEqual({
              createMemberDialog: {
                open: false
              }
            })
          })

          it('handles UPDATE_CREATE_MEMBER_DIALOG_DATA action', () => {
            expect(
              reducer(
                {
                  createMemberDialog: {
                    data: {
                      firstname: '',
                      lastname: '',
                      nr: ''
                    }
                  }
                },
                actions.updateCreateMemberDialogData({
                  firstname: 'Max',
                  lastname: 'Muster',
                  nr: '34534'
                })
              )
            ).toEqual({
              createMemberDialog: {
                data: {
                  firstname: 'Max',
                  lastname: 'Muster',
                  nr: '34534'
                }
              }
            })
          })

          it('handles SET_CREATE_MEMBER_DIALOG_SUBMITTING action', () => {
            expect(
              reducer(
                {
                  createMemberDialog: {
                    submitting: false
                  }
                },
                actions.setCreateMemberDialogSubmitting()
              )
            ).toEqual({
              createMemberDialog: {
                submitting: true
              }
            })
          })

          it('handles CREATE_MEMBER_SUCCESS action', () => {
            expect(
              reducer(
                {
                  createMemberDialog: {
                    open: true
                  }
                },
                actions.createMemberSuccess()
              )
            ).toEqual({
              createMemberDialog: {
                open: false
              }
            })
          })

          it('handles CREATE_MEMBER_FAILURE action', () => {
            expect(
              reducer(
                {
                  createMemberDialog: {
                    submitting: true
                  }
                },
                actions.createMemberFailure()
              )
            ).toEqual({
              createMemberDialog: {
                submitting: false
              }
            })
          })

          it('handles OPEN_DELETE_MEMBER_DIALOG action', () => {
            const member = {
              firstname: 'Max',
              lastname: 'Muster',
              nr: '34534'
            }
            expect(
              reducer(
                {
                  deleteMemberDialog: {
                    open: false
                  }
                },
                actions.openDeleteMemberDialog(member)
              )
            ).toEqual({
              deleteMemberDialog: {
                open: true,
                submitting: false,
                member
              }
            })
          })

          it('handles CLOSE_DELETE_MEMBER_DIALOG action', () => {
            expect(
              reducer(
                {
                  deleteMemberDialog: {
                    open: true
                  }
                },
                actions.closeDeleteMemberDialog()
              )
            ).toEqual({
              deleteMemberDialog: {
                open: false
              }
            })
          })

          it('handles DELETE_MEMBER action', () => {
            expect(
              reducer(
                {
                  deleteMemberDialog: {
                    submitting: false
                  }
                },
                actions.deleteMember()
              )
            ).toEqual({
              deleteMemberDialog: {
                submitting: true
              }
            })
          })

          it('handles SET_MEMBERS_PAGE action', () => {
            expect(
              reducer(
                {
                  members: {
                    page: 1
                  }
                },
                actions.setMembersPage(2)
              )
            ).toEqual({
              members: {
                page: 2
              }
            })
          })

          it('handles SET_EXPORT_FLIGHTS_FORM_SUBMITTING action', () => {
            expect(
              reducer(
                {
                  exportFlightsForm: {
                    submitting: false,
                    data: {
                      startDate: '2019-08-01',
                      endDate: '2019-08-31'
                    }
                  }
                },
                actions.setExportFlightsDialogSubmitting(true)
              )
            ).toEqual({
              exportFlightsForm: {
                submitting: true,
                data: {
                  startDate: '2019-08-01',
                  endDate: '2019-08-31'
                }
              }
            })
          })

          it('handles UPDATE_EXPORT_FLIGHTS_FORM_DATA action', () => {
            expect(
              reducer(
                {
                  exportFlightsForm: {
                    submitting: false,
                    data: {
                      startDate: '2019-08-01',
                      endDate: '2019-08-31'
                    }
                  }
                },
                actions.updateExportFlightsFormData({
                  startDate: '2019-07-01'
                })
              )
            ).toEqual({
              exportFlightsForm: {
                submitting: false,
                data: {
                  startDate: '2019-07-01',
                  endDate: '2019-08-31'
                }
              }
            })
          })
        })
      })
    })
  })
})
