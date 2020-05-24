import * as actions from './actions'
import reducer, { validateCheck } from './reducer'

export const INITIAL_STATE = {
  createCheckDialog: {
    open: false,
    submitting: false,
    valid: false,
    data: {
      description: '',
      dateLimit: null,
      counterLimit: null,
      counterReference: null
    }
  },
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

              it('handles OPEN_CREATE_CHECK_DIALOG action', () => {
                expect(
                  reducer(
                    {
                      createCheckDialog: {
                        submitting: true,
                        open: false,
                        data: {
                          description: 'Jet A1',
                          dateLimit: null,
                          counterLimit: null,
                          counterReference: null
                        }
                      }
                    },
                    actions.openCreateCheckDialog()
                  )
                ).toEqual({
                  createCheckDialog: {
                    ...INITIAL_STATE.createCheckDialog,
                    open: true
                  }
                })
              })

              it('handles CLOSE_CREATE_CHECK_DIALOG action', () => {
                expect(
                  reducer(
                    {
                      createCheckDialog: {
                        open: true
                      }
                    },
                    actions.closeCreateCheckDialog()
                  )
                ).toEqual({
                  createCheckDialog: {
                    open: false
                  }
                })
              })

              it('handles UPDATE_CREATE_CHECK_DIALOG_DATA action', () => {
                expect(
                  reducer(
                    {
                      createCheckDialog: {
                        data: {
                          description: 'Nächste 50-Stunden-Kontrolle'
                        }
                      }
                    },
                    actions.updateCreateCheckDialogData({
                      counterLimit: 1200,
                      counterReference: 'flightHours'
                    })
                  )
                ).toEqual({
                  createCheckDialog: {
                    valid: true,
                    data: {
                      description: 'Nächste 50-Stunden-Kontrolle',
                      counterLimit: 1200,
                      counterReference: 'flightHours'
                    }
                  }
                })
              })

              it('handles SET_CREATE_CHECK_DIALOG_SUBMITTING action', () => {
                expect(
                  reducer(
                    {
                      createCheckDialog: {
                        submitting: false
                      }
                    },
                    actions.setCreateCheckDialogSubmitting({})
                  )
                ).toEqual({
                  createCheckDialog: {
                    submitting: true
                  }
                })
              })

              it('handles CREATE_CHECK_SUCCESS action', () => {
                expect(
                  reducer(
                    {
                      createCheckDialog: {
                        open: true
                      }
                    },
                    actions.createCheckSuccess()
                  )
                ).toEqual({
                  createCheckDialog: {
                    open: false
                  }
                })
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

              describe('validateCheck', () => {
                it('returns true if description and date limit set', () => {
                  expect(
                    validateCheck({
                      description: 'Next Foobar Check',
                      dateLimit: new Date(2020, 6, 30)
                    })
                  ).toEqual(true)
                })

                it('returns true if description and counter limit set', () => {
                  expect(
                    validateCheck({
                      description: 'Next Foobar Check',
                      counterLimit: 500,
                      counterReference: 'landings'
                    })
                  ).toEqual(true)
                })

                it('returns true if description, date and counter limit set', () => {
                  expect(
                    validateCheck({
                      description: 'Next Foobar Check',
                      dateLimit: new Date(2020, 6, 30),
                      counterLimit: 500,
                      counterReference: 'landings'
                    })
                  ).toEqual(true)
                })

                it('returns false if description missing', () => {
                  expect(
                    validateCheck({
                      dateLimit: new Date(2020, 6, 30)
                    })
                  ).toEqual(false)
                })

                it('returns false if no limit set', () => {
                  expect(
                    validateCheck({
                      description: 'Next Foobar Check'
                    })
                  ).toEqual(false)
                })

                it('returns false if counter limit without reference set', () => {
                  expect(
                    validateCheck({
                      description: 'Next Foobar Check',
                      counterLimit: 500
                    })
                  ).toEqual(false)
                })

                it('returns false if counter reference without limit set', () => {
                  expect(
                    validateCheck({
                      description: 'Next Foobar Check',
                      counterReference: 'landings'
                    })
                  ).toEqual(false)
                })
              })
            })
          })
        })
      })
    })
  })
})
