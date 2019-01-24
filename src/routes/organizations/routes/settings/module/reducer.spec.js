import * as actions from './actions'
import reducer from './reducer'

export const INITIAL_STATE = {
  createMemberDialog: {
    open: false,
    submitting: false,
    data: {
      firstname: '',
      lastname: ''
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
                      lastname: 'Meier'
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
                  lastname: ''
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
                      lastname: ''
                    }
                  }
                },
                actions.updateCreateMemberDialogData({
                  firstname: 'Max',
                  lastname: 'Muster'
                })
              )
            ).toEqual({
              createMemberDialog: {
                data: {
                  firstname: 'Max',
                  lastname: 'Muster'
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
        })
      })
    })
  })
})
