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
      nr: '',
      roles: [],
      inviteEmail: ''
    }
  },
  deleteMemberDialog: {
    open: false,
    submitting: false
  },
  editMemberDialog: {
    open: false,
    submitting: false,
    member: undefined,
    data: {
      firstname: '',
      lastname: '',
      nr: '',
      roles: [],
      inviteEmail: '',
      reinvite: false
    }
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
    page: 0,
    filter: ''
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
                      nr: '34534',
                      roles: ['manager', 'techlogmanager'],
                      inviteEmail: ''
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
                  nr: '',
                  roles: [],
                  inviteEmail: ''
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
                      nr: '',
                      roles: []
                    }
                  }
                },
                actions.updateCreateMemberDialogData({
                  firstname: 'Max',
                  lastname: 'Muster',
                  nr: '34534',
                  roles: ['manager', 'techlogmanager']
                })
              )
            ).toEqual({
              createMemberDialog: {
                data: {
                  firstname: 'Max',
                  lastname: 'Muster',
                  nr: '34534',
                  roles: ['manager', 'techlogmanager']
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

          it('handles OPEN_EDIT_MEMBER_DIALOG action', () => {
            const member = {
              firstname: 'Max',
              lastname: 'Keller',
              nr: '34345',
              roles: ['manager', 'techlogmanager'],
              inviteEmail: 'hans@keller.ch'
            }

            expect(
              reducer(
                {
                  editMemberDialog: {
                    open: false,
                    submitting: true,
                    data: {
                      firstname: '',
                      lastname: '',
                      nr: '',
                      roles: [],
                      inviteEmail: ''
                    }
                  }
                },
                actions.openEditMemberDialog(member)
              )
            ).toEqual({
              editMemberDialog: {
                open: true,
                submitting: false,
                member,
                data: {
                  firstname: 'Max',
                  lastname: 'Keller',
                  nr: '34345',
                  roles: ['manager', 'techlogmanager'],
                  inviteEmail: 'hans@keller.ch'
                }
              }
            })
          })

          it('handles CLOSE_EDIT_MEMBER_DIALOG action', () => {
            expect(
              reducer(
                {
                  editMemberDialog: {
                    open: true
                  }
                },
                actions.closeEditMemberDialog()
              )
            ).toEqual({
              editMemberDialog: INITIAL_STATE.editMemberDialog
            })
          })

          it('handles UPDATE_EDIT_MEMBER_DIALOG_DATA action', () => {
            expect(
              reducer(
                {
                  editMemberDialog: {
                    data: {
                      firstname: 'Max',
                      lastname: '',
                      nr: '',
                      roles: ['manager', 'techlogmanager']
                    }
                  }
                },
                actions.updateEditMemberDialogData({
                  lastname: 'Muster',
                  nr: '34534',
                  roles: ['manager']
                })
              )
            ).toEqual({
              editMemberDialog: {
                data: {
                  firstname: 'Max',
                  lastname: 'Muster',
                  nr: '34534',
                  roles: ['manager']
                }
              }
            })
          })

          it('handles SET_EDIT_MEMBER_DIALOG_SUBMITTING action', () => {
            expect(
              reducer(
                {
                  editMemberDialog: {
                    submitting: false
                  }
                },
                actions.setEditMemberDialogSubmitting()
              )
            ).toEqual({
              editMemberDialog: {
                submitting: true
              }
            })
          })

          it('handles UPDATE_MEMBER_SUCCESS action', () => {
            expect(
              reducer(
                {
                  editMemberDialog: {
                    open: true
                  }
                },
                actions.updateMemberSuccess()
              )
            ).toEqual({
              editMemberDialog: INITIAL_STATE.editMemberDialog
            })
          })

          it('handles UPDATE_MEMBER_FAILURE action', () => {
            expect(
              reducer(
                {
                  editMemberDialog: {
                    submitting: true
                  }
                },
                actions.updateMemberFailure()
              )
            ).toEqual({
              editMemberDialog: {
                submitting: false
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

          it('handles SET_MEMBERS_FILTER action', () => {
            expect(
              reducer(
                {
                  members: {
                    page: 3,
                    filter: ''
                  }
                },
                actions.setMembersFilter('hans')
              )
            ).toEqual({
              members: {
                page: 0,
                filter: 'hans'
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
