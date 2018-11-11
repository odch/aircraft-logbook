import reducer from './reducer'
import * as actions from './actions'

const INITIAL_STATE = {
  createDialogOpen: false,
  createDialogData: {
    name: ''
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
              createDialogOpen: false,
              createDialogData: {
                name: 'foo'
              }
            },
            actions.openCreateOrganizationDialog()
          )
        ).toEqual({
          createDialogOpen: true,
          createDialogData: {
            name: ''
          }
        })
      })

      it('handles the CLOSE_CREATE_ORGANIZATION_DIALOG action', () => {
        expect(
          reducer(
            { createDialogOpen: true },
            actions.closeCreateOrganizationDialog()
          )
        ).toEqual({
          createDialogOpen: false
        })
      })

      it('handles the UPDATE_CREATE_ORGANIZATION_DIALOG_DATA action', () => {
        expect(
          reducer(
            {
              createDialogData: {
                name: 'foo'
              }
            },
            actions.updateCreateOrganizationDialogData({ name: 'foobar' })
          )
        ).toEqual({
          createDialogData: {
            name: 'foobar'
          }
        })
      })

      it('handles the CREATE_ORGANIZATION_SUCCESS action', () => {
        expect(
          reducer(
            { createDialogOpen: true },
            actions.createOrganizationSuccess()
          )
        ).toEqual({
          createDialogOpen: false
        })
      })
    })
  })
})
