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
  deleteCheckDialog: {
    open: false,
    submitting: false,
    check: null
  },
  createFuelTypeDialog: {
    open: false,
    submitting: false,
    data: {
      name: '',
      description: ''
    }
  },
  deleteFuelTypeDialog: {
    open: false,
    submitting: false,
    fuelType: null
  },
  advancedSettings: {
    submitting: {}
  },
  deleteAircraftDialog: {
    open: false,
    submitting: false
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

              it('handles CREATE_CHECK_FAILURE action', () => {
                expect(
                  reducer(
                    {
                      createCheckDialog: {
                        open: true,
                        submitting: true
                      }
                    },
                    actions.createCheckFailure()
                  )
                ).toEqual({
                  createCheckDialog: {
                    open: true,
                    submitting: false
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

              it('handles OPEN_DELETE_CHECK_DIALOG action', () => {
                expect(
                  reducer(
                    {
                      deleteCheckDialog: {
                        submitting: true,
                        open: false,
                        check: {
                          description: 'Next Foobar Check',
                          dateLimit: new Date(2020, 6, 30)
                        }
                      }
                    },
                    actions.openDeleteCheckDialog({
                      description: 'Some Check',
                      counterLimit: 100,
                      counterReference: 'landings'
                    })
                  )
                ).toEqual({
                  deleteCheckDialog: {
                    ...INITIAL_STATE.deleteCheckDialog,
                    open: true,
                    check: {
                      description: 'Some Check',
                      counterLimit: 100,
                      counterReference: 'landings'
                    }
                  }
                })
              })

              it('handles CLOSE_DELETE_CHECK_DIALOG action', () => {
                expect(
                  reducer(
                    {
                      deleteCheckDialog: {
                        open: true
                      }
                    },
                    actions.closeDeleteCheckDialog()
                  )
                ).toEqual({
                  deleteCheckDialog: {
                    open: false
                  }
                })
              })

              it('handles SET_DELETE_CHECK_DIALOG_SUBMITTING action', () => {
                expect(
                  reducer(
                    {
                      deleteCheckDialog: {
                        submitting: false
                      }
                    },
                    actions.setDeleteCheckDialogSubmitting()
                  )
                ).toEqual({
                  deleteCheckDialog: {
                    submitting: true
                  }
                })
              })

              it('handles OPEN_DELETE_FUEL_TYPE_DIALOG action', () => {
                expect(
                  reducer(
                    {
                      deleteFuelTypeDialog: {
                        submitting: true,
                        open: false,
                        fuelType: {
                          name: 'jet_a1',
                          description: 'Jet A1'
                        }
                      }
                    },
                    actions.openDeleteFuelTypeDialog({
                      name: 'diesel',
                      description: 'Diesel'
                    })
                  )
                ).toEqual({
                  deleteFuelTypeDialog: {
                    ...INITIAL_STATE.deleteFuelTypeDialog,
                    open: true,
                    fuelType: {
                      name: 'diesel',
                      description: 'Diesel'
                    }
                  }
                })
              })

              it('handles CLOSE_DELETE_FUEL_TYPE_DIALOG action', () => {
                expect(
                  reducer(
                    {
                      deleteFuelTypeDialog: {
                        open: true
                      }
                    },
                    actions.closeDeleteFuelTypeDialog()
                  )
                ).toEqual({
                  deleteFuelTypeDialog: {
                    open: false
                  }
                })
              })

              it('handles SET_DELETE_FUEL_TYPE_DIALOG_SUBMITTING action', () => {
                expect(
                  reducer(
                    {
                      deleteFuelTypeDialog: {
                        submitting: false
                      }
                    },
                    actions.setDeleteFuelTypeDialogSubmitting()
                  )
                ).toEqual({
                  deleteFuelTypeDialog: {
                    submitting: true
                  }
                })
              })

              it('handles SET_SETTING_SUBMITTING action', () => {
                expect(
                  reducer(
                    {
                      advancedSettings: {
                        submitting: {
                          techlogEnabled: false,
                          engineHoursCounterEnabled: true
                        }
                      }
                    },
                    actions.setSettingSubmitting('techlogEnabled', true)
                  )
                ).toEqual({
                  advancedSettings: {
                    submitting: {
                      techlogEnabled: true,
                      engineHoursCounterEnabled: true
                    }
                  }
                })
              })

              it('handles OPEN_DELETE_AIRCRAFT_DIALOG action', () => {
                expect(
                  reducer(
                    {
                      deleteAircraftDialog: {
                        submitting: true,
                        open: false
                      }
                    },
                    actions.openDeleteAircraftDialog()
                  )
                ).toEqual({
                  deleteAircraftDialog: {
                    ...INITIAL_STATE.deleteAircraftDialog,
                    open: true
                  }
                })
              })

              it('handles CLOSE_DELETE_AIRCRAFT_DIALOG action', () => {
                expect(
                  reducer(
                    {
                      deleteAircraftDialog: {
                        open: true
                      }
                    },
                    actions.closeDeleteAircraftDialog()
                  )
                ).toEqual({
                  deleteAircraftDialog: {
                    open: false
                  }
                })
              })

              it('handles SET_DELETE_AIRCRAFT_DIALOG_SUBMITTING action', () => {
                expect(
                  reducer(
                    {
                      deleteAircraftDialog: {
                        submitting: false
                      }
                    },
                    actions.setDeleteAircraftDialogSubmitting()
                  )
                ).toEqual({
                  deleteAircraftDialog: {
                    submitting: true
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
