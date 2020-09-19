import reducer from './reducer'
import * as actions from './actions'

const INITIAL_STATE = {
  createDialog: {
    open: false,
    submitted: false,
    data: {
      name: ''
    }
  }
}

describe('modules', () => {
  describe('organizations', () => {
    describe('reducer', () => {
      it('defines an initial state', () => {
        expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
      })

      it('handles the OPEN_CREATE_ORGANIZATION_DIALOG action', () => {
        expect(
          reducer(
            {
              createDialog: {
                open: false,
                sumitted: true,
                data: {
                  name: 'foo'
                }
              }
            },
            actions.openCreateOrganizationDialog()
          )
        ).toEqual({
          createDialog: {
            open: true,
            submitted: false,
            data: {
              name: ''
            }
          }
        })
      })

      it('handles the CLOSE_CREATE_ORGANIZATION_DIALOG action', () => {
        expect(
          reducer(
            {
              createDialog: {
                open: true
              }
            },
            actions.closeCreateOrganizationDialog()
          )
        ).toEqual({
          createDialog: {
            open: false
          }
        })
      })

      it('handles the UPDATE_CREATE_ORGANIZATION_DIALOG_DATA action', () => {
        expect(
          reducer(
            {
              createDialog: {
                data: {
                  name: 'foo'
                }
              }
            },
            actions.updateCreateOrganizationDialogData({ name: 'foobar' })
          )
        ).toEqual({
          createDialog: {
            data: {
              name: 'foobar'
            }
          }
        })
      })

      it('handles the CREATE_ORGANIZATION_SUCCESS action', () => {
        expect(
          reducer(
            {
              createDialog: {
                open: true
              }
            },
            actions.createOrganizationSuccess()
          )
        ).toEqual({
          createDialog: {
            open: false
          }
        })
      })
    })
  })
})
