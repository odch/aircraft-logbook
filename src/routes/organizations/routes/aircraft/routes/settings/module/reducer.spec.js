import * as actions from './actions'
import reducer from './reducer'

export const INITIAL_STATE = {
  createFuelTypeDialog: {
    open: false,
    submitting: false,
    data: {
      name: '',
      description: ''
    }
  }
}

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('routes', () => {
          describe('settings', () => {
            describe('reducer', () => {
              it('defines an initial state', () => {
                expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
              })

              it('handles OPEN_CREATE_FUEL_TYPE_DIALOG action', () => {
                expect(
                  reducer(
                    {
                      createFuelTypeDialog: {
                        submitting: true,
                        open: false,
                        data: {
                          name: 'jet_a1',
                          description: 'Jet A1'
                        }
                      }
                    },
                    actions.openCreateFuelTypeDialog()
                  )
                ).toEqual({
                  createFuelTypeDialog: {
                    ...INITIAL_STATE.createFuelTypeDialog,
                    open: true
                  }
                })
              })

              it('handles CLOSE_CREATE_FUEL_TYPE_DIALOG action', () => {
                expect(
                  reducer(
                    {
                      createFuelTypeDialog: {
                        open: true
                      }
                    },
                    actions.closeCreateFuelTypeDialog()
                  )
                ).toEqual({
                  createFuelTypeDialog: {
                    open: false
                  }
                })
              })

              it('handles UPDATE_CREATE_FUEL_TYPE_DIALOG_DATA action', () => {
                expect(
                  reducer(
                    {
                      createFuelTypeDialog: {
                        data: {
                          name: 'jet_a1',
                          description: ''
                        }
                      }
                    },
                    actions.updateCreateFuelTypeDialogData({
                      description: 'Jet A1'
                    })
                  )
                ).toEqual({
                  createFuelTypeDialog: {
                    data: {
                      name: 'jet_a1',
                      description: 'Jet A1'
                    }
                  }
                })
              })

              it('handles SET_CREATE_FUEL_TYPE_DIALOG_SUBMITTING action', () => {
                expect(
                  reducer(
                    {
                      createFuelTypeDialog: {
                        submitting: false
                      }
                    },
                    actions.setCreateFuelTypeDialogSubmitting({})
                  )
                ).toEqual({
                  createFuelTypeDialog: {
                    submitting: true
                  }
                })
              })

              it('handles CREATE_FUEL_TYPE_SUCCESS action', () => {
                expect(
                  reducer(
                    {
                      createFuelTypeDialog: {
                        open: true
                      }
                    },
                    actions.createFuelTypeSuccess()
                  )
                ).toEqual({
                  createFuelTypeDialog: {
                    open: false
                  }
                })
              })
            })
          })
        })
      })
    })
  })
})
