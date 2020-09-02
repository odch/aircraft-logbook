import * as actions from './actions'
import reducer, { updateLandingTime } from './reducer'

const INITIAL_STATE = {
  createFlightDialog: {
    open: false,
    submitting: false,
    data: {
      initialized: false
    },
    initialData: {}
  },
  deleteFlightDialog: {
    open: false
  },
  createAerodromeDialog: {
    open: false,
    fieldName: null,
    data: {
      identification: '',
      name: '',
      timezone: null
    }
  },
  flights: {
    organizationId: null,
    aircraftId: null,
    page: 0,
    rowsPerPage: 10
  },
  techlog: {
    organizationId: null,
    aircraftId: null,
    page: 0,
    rowsPerPage: 10,
    showOnlyOpen: false
  },
  createTechlogEntryDialog: {
    open: false,
    submitting: false,
    data: {
      description: '',
      status: null,
      attachments: []
    }
  },
  createTechlogEntryActionDialog: {
    open: false,
    submitting: false,
    techlogEntryId: null,
    data: {
      description: '',
      status: null,
      signature: false,
      attachments: []
    }
  }
}

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('reducer', () => {
          it('defines an initial state', () => {
            expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
          })

          it('handles SET_FLIGHTS_PAGE action', () => {
            expect(
              reducer(
                {
                  flights: {
                    page: 1,
                    rowsPerPage: 10
                  }
                },
                actions.setFlightsPage(2)
              )
            ).toEqual({
              flights: {
                page: 2,
                rowsPerPage: 10
              }
            })
          })

          it('handles SET_FLIGHTS_PARAMS action', () => {
            expect(
              reducer(
                {
                  flights: {
                    organizationId: null,
                    aircraftId: null,
                    page: 12,
                    rowsPerPage: 10
                  }
                },
                actions.setFlightsParams('my_org', 'my_aircraft', 5)
              )
            ).toEqual({
              flights: {
                organizationId: 'my_org',
                aircraftId: 'my_aircraft',
                page: 0,
                rowsPerPage: 5
              }
            })
          })

          it('handles OPEN_CREATE_FLIGHT_DIALOG action', () => {
            expect(
              reducer(
                {
                  createFlightDialog: {
                    submitting: true,
                    open: false,
                    data: {
                      date: '2018-12-15',
                      blockOffTime: '2018-12-15 10:15'
                    }
                  }
                },
                actions.openCreateFlightDialog()
              )
            ).toEqual({
              createFlightDialog: {
                submitting: false,
                open: true,
                data: INITIAL_STATE.createFlightDialog.data,
                initialData: {}
              }
            })
          })

          it('handles CLOSE_CREATE_FLIGHT_DIALOG action', () => {
            expect(
              reducer(
                {
                  createFlightDialog: {
                    open: true
                  }
                },
                actions.closeCreateFlightDialog()
              )
            ).toEqual({
              createFlightDialog: {
                open: false
              }
            })
          })

          it('handles SET_INITIAL_CREATE_FLIGHT_DIALOG_DATA action', () => {
            expect(
              reducer(
                {
                  createFlightDialog: {
                    data: {
                      initialized: false,
                      date: null,
                      counters: {
                        flightTimeCounter: {
                          start: null,
                          end: null
                        }
                      }
                    }
                  }
                },
                actions.setInitialCreateFlightDialogData({
                  date: '2018-12-15',
                  counters: {
                    flightTimeCounter: {
                      start: 348967
                    }
                  }
                })
              )
            ).toEqual({
              createFlightDialog: {
                data: {
                  initialized: true,
                  date: '2018-12-15',
                  counters: {
                    flightTimeCounter: {
                      start: 348967
                    }
                  }
                },
                initialData: {
                  date: '2018-12-15',
                  counters: {
                    flightTimeCounter: {
                      start: 348967
                    }
                  }
                }
              }
            })
          })

          it('handles UPDATE_CREATE_FLIGHT_DIALOG_DATA action', () => {
            expect(
              reducer(
                {
                  createFlightDialog: {
                    data: {
                      date: '2018-12-15',
                      blockOffTime: '2018-12-15 10:15',
                      counters: {
                        flightTimeCounter: {
                          start: 348967,
                          end: null
                        }
                      }
                    },
                    validationErrors: {
                      blockOnTime: 'invalid',
                      takeOffTime: 'invalid'
                    }
                  }
                },
                actions.updateCreateFlightDialogData({
                  'counters.flightTimeCounter.start': 348970,
                  blockOffTime: '2018-12-15 10:30',
                  blockOnTime: '2018-12-15 11:30'
                })
              )
            ).toEqual({
              createFlightDialog: {
                data: {
                  date: '2018-12-15',
                  blockOffTime: '2018-12-15 10:30',
                  blockOnTime: '2018-12-15 11:30',
                  counters: {
                    flightTimeCounter: {
                      start: 348970,
                      end: null
                    }
                  }
                },
                validationErrors: {
                  takeOffTime: 'invalid'
                }
              }
            })
          })

          it('sets landing time in UPDATE_CREATE_FLIGHT_DIALOG_DATA handler', () => {
            expect(
              reducer(
                {
                  createFlightDialog: {
                    data: {
                      takeOffTime: '2018-12-15 10:15',
                      counters: {
                        flightTimeCounter: {
                          start: 348967,
                          end: null
                        }
                      },
                      departureAerodrome: {
                        timezone: 'Europe/London'
                      },
                      destinationAerodrome: {
                        timezone: 'Europe/Zurich'
                      }
                    }
                  }
                },
                actions.updateCreateFlightDialogData({
                  'counters.flightTimeCounter.end': 348977
                })
              )
            ).toEqual({
              createFlightDialog: {
                data: {
                  takeOffTime: '2018-12-15 10:15',
                  landingTime: '2018-12-15 11:21',
                  counters: {
                    flightTimeCounter: {
                      start: 348967,
                      end: 348977
                    }
                  },
                  departureAerodrome: {
                    timezone: 'Europe/London'
                  },
                  destinationAerodrome: {
                    timezone: 'Europe/Zurich'
                  }
                },
                validationErrors: {}
              }
            })
          })

          it('handles SET_CREATE_FLIGHT_DIALOG_SUBMITTING action', () => {
            expect(
              reducer(
                {
                  createFlightDialog: {
                    submitting: false
                  }
                },
                actions.setCreateFlightDialogSubmitting({})
              )
            ).toEqual({
              createFlightDialog: {
                submitting: true
              }
            })
          })

          it('handles CREATE_FLIGHT_FAILURE action', () => {
            expect(
              reducer(
                {
                  createFlightDialog: {
                    submitting: true
                  }
                },
                actions.createFlightFailure({})
              )
            ).toEqual({
              createFlightDialog: {
                submitting: false
              }
            })
          })

          it('handles SET_FLIGHT_VALIDATION_ERRORS action', () => {
            expect(
              reducer(
                {
                  createFlightDialog: {
                    submitting: true,
                    validationErrors: {
                      blockOnTime: 'invalid',
                      takeOffTime: 'invalid'
                    }
                  }
                },
                actions.setFlightValidationErrors({
                  takeOffTime: 'invalid',
                  landings: 'required'
                })
              )
            ).toEqual({
              createFlightDialog: {
                submitting: false,
                validationErrors: {
                  takeOffTime: 'invalid',
                  landings: 'required'
                }
              }
            })
          })

          it('handles OPEN_DELETE_FLIGHT_DIALOG action', () => {
            expect(
              reducer(
                {
                  deleteFlightDialog: {
                    open: false
                  }
                },
                actions.openDeleteFlightDialog({
                  id: 'flight-id'
                })
              )
            ).toEqual({
              deleteFlightDialog: {
                open: true,
                flight: {
                  id: 'flight-id'
                }
              }
            })
          })

          it('handles CLOSE_DELETE_FLIGHT_DIALOG action', () => {
            expect(
              reducer(
                {
                  deleteFlightDialog: {
                    open: true,
                    flight: {
                      id: 'flight-id'
                    }
                  }
                },
                actions.closeDeleteFlightDialog()
              )
            ).toEqual({
              deleteFlightDialog: {
                open: false
              }
            })
          })

          it('handles DELETE_FLIGHT action (set submitted)', () => {
            expect(
              reducer(
                {
                  deleteFlightDialog: {
                    open: true,
                    flight: {
                      id: 'flight-id'
                    }
                  }
                },
                actions.deleteFlight('my_org', 'aircraft-id', 'flight-id')
              )
            ).toEqual({
              deleteFlightDialog: {
                open: true,
                submitted: true,
                flight: {
                  id: 'flight-id'
                }
              }
            })
          })

          it('handles OPEN_CREATE_AERODROME_DIALOG action', () => {
            expect(
              reducer(
                {
                  createAerodromeDialog: {
                    submitting: true,
                    open: false,
                    data: {
                      identification: 'LSXX',
                      name: 'Hagenbuch',
                      timezone: 'Europe/Zurich'
                    }
                  }
                },
                actions.openCreateAerodromeDialog('destinationAerodrome')
              )
            ).toEqual({
              createAerodromeDialog: {
                open: true,
                fieldName: 'destinationAerodrome',
                data: INITIAL_STATE.createAerodromeDialog.data
              }
            })
          })

          it('handles CLOSE_CREATE_AERODROME_DIALOG action', () => {
            expect(
              reducer(
                {
                  createAerodromeDialog: {
                    open: true
                  }
                },
                actions.closeCreateAerodromeDialog()
              )
            ).toEqual({
              createAerodromeDialog: {
                open: false
              }
            })
          })

          it('handles SET_CREATE_AERODROME_DIALOG_SUBMITTING action', () => {
            expect(
              reducer(
                {
                  createAerodromeDialog: {
                    submitting: false,
                    open: true,
                    data: {
                      identification: 'LSXX',
                      name: 'Hagenbuch',
                      timezone: 'Europe/Zurich'
                    }
                  }
                },
                actions.setCreateAerodromeDialogSubmitting()
              )
            ).toEqual({
              createAerodromeDialog: {
                submitting: true,
                open: true,
                data: {
                  identification: 'LSXX',
                  name: 'Hagenbuch',
                  timezone: 'Europe/Zurich'
                }
              }
            })
          })

          it('handles CREATE_AERODROME_FAILURE action', () => {
            expect(
              reducer(
                {
                  createAerodromeDialog: {
                    submitting: true,
                    open: true,
                    data: {
                      identification: 'LSXX',
                      name: 'Hagenbuch',
                      timezone: 'Europe/Zurich'
                    }
                  }
                },
                actions.createAeorodromeFailure()
              )
            ).toEqual({
              createAerodromeDialog: {
                submitting: false,
                open: true,
                data: {
                  identification: 'LSXX',
                  name: 'Hagenbuch',
                  timezone: 'Europe/Zurich'
                }
              }
            })
          })

          it('handles UPDATE_CREATE_AERODROME_DIALOG_DATA action', () => {
            expect(
              reducer(
                {
                  createAerodromeDialog: {
                    submitting: false,
                    open: true,
                    data: {
                      identification: 'LSXX',
                      name: 'H',
                      timezone: 'Europe/Zurich'
                    }
                  }
                },
                actions.updateCreateAerodromeDialogData({
                  name: 'Hagenbuch'
                })
              )
            ).toEqual({
              createAerodromeDialog: {
                submitting: false,
                open: true,
                data: {
                  identification: 'LSXX',
                  name: 'Hagenbuch',
                  timezone: 'Europe/Zurich'
                }
              }
            })
          })

          it('handles SET_TECHLOG_PAGE action', () => {
            expect(
              reducer(
                {
                  techlog: { page: 1 }
                },
                actions.setTechlogPage(2)
              )
            ).toEqual({
              techlog: { page: 2 }
            })
          })

          it('handles SET_TECHLOG_PARAMS action', () => {
            expect(
              reducer(
                {
                  techlog: {
                    organizationId: null,
                    aircraftId: null,
                    page: 0,
                    rowsPerPage: 10,
                    showOnlyOpen: false
                  }
                },
                actions.setTechlogParams('my_org', 'my_aircraft', true)
              )
            ).toEqual({
              techlog: {
                organizationId: 'my_org',
                aircraftId: 'my_aircraft',
                page: 0,
                rowsPerPage: undefined,
                showOnlyOpen: true
              }
            })
          })

          it('handles OPEN_CREATE_TECHLOG_ENTRY_DIALOG action', () => {
            expect(
              reducer(
                {
                  createTechlogEntryDialog: {
                    open: false,
                    submitting: true,
                    data: {
                      description: 'big problem',
                      status: 'not_airworthy',
                      attachments: [{ name: 'att1.jpeg' }]
                    }
                  }
                },
                actions.openCreateTechlogEntryDialog()
              )
            ).toEqual({
              createTechlogEntryDialog: {
                open: true,
                submitting: false,
                data: {
                  description: '',
                  status: null,
                  attachments: []
                }
              }
            })
          })

          it('handles CLOSE_CREATE_TECHLOG_ENTRY_DIALOG action', () => {
            expect(
              reducer(
                {
                  createTechlogEntryDialog: {
                    open: true
                  }
                },
                actions.closeCreateTechlogEntryDialog()
              )
            ).toEqual({
              createTechlogEntryDialog: {
                open: false
              }
            })
          })

          it('handles OPEN_CREATE_TECHLOG_ENTRY_ACTION_DIALOG action', () => {
            expect(
              reducer(
                {
                  createTechlogEntryActionDialog: {
                    open: false,
                    submitting: true,
                    techlogEntryId: 'entry-1',
                    data: {
                      description: 'action xyz taken',
                      status: { value: 'crs' },
                      signature: true,
                      attachments: [{ name: 'att1.jpeg' }]
                    }
                  }
                },
                actions.openCreateTechlogEntryActionDialog(
                  'entry-2',
                  'for_information_only'
                )
              )
            ).toEqual({
              createTechlogEntryActionDialog: {
                open: true,
                submitting: false,
                techlogEntryId: 'entry-2',
                data: {
                  description: '',
                  status: 'for_information_only',
                  signature: false,
                  attachments: []
                }
              }
            })
          })

          it('handles CLOSE_CREATE_TECHLOG_ENTRY_ACTION_DIALOG action', () => {
            expect(
              reducer(
                {
                  createTechlogEntryActionDialog: {
                    open: true
                  }
                },
                actions.closeCreateTechlogEntryActionDialog()
              )
            ).toEqual({
              createTechlogEntryActionDialog: {
                open: false
              }
            })
          })

          it('handles SET_CREATE_TECHLOG_ENTRY_DIALOG_SUBMITTING action', () => {
            expect(
              reducer(
                {
                  createTechlogEntryDialog: { submitting: false }
                },
                actions.setCreateTechlogEntryDialogSubmitting()
              )
            ).toEqual({
              createTechlogEntryDialog: { submitting: true }
            })
          })

          it('handles SET_CREATE_TECHLOG_ENTRY_ACTION_DIALOG_SUBMITTING action', () => {
            expect(
              reducer(
                {
                  createTechlogEntryActionDialog: { submitting: false }
                },
                actions.setCreateTechlogEntryActionDialogSubmitting()
              )
            ).toEqual({
              createTechlogEntryActionDialog: { submitting: true }
            })
          })

          it('handles CREATE_TECHLOG_ENTRY_FAILURE action', () => {
            expect(
              reducer(
                {
                  createTechlogEntryDialog: { submitting: true }
                },
                actions.createTechlogEntryFailure()
              )
            ).toEqual({
              createTechlogEntryDialog: { submitting: false }
            })
          })

          it('handles CREATE_TECHLOG_ENTRY_ACTION_FAILURE action', () => {
            expect(
              reducer(
                {
                  createTechlogEntryActionDialog: { submitting: true }
                },
                actions.createTechlogEntryActionFailure()
              )
            ).toEqual({
              createTechlogEntryActionDialog: { submitting: false }
            })
          })

          it('handles UPDATE_CREATE_TECHLOG_ENTRY_DIALOG_DATA action', () => {
            expect(
              reducer(
                {
                  createTechlogEntryDialog: {
                    submitting: false,
                    open: true,
                    data: {
                      description: '',
                      status: { value: 'for_information_only' }
                    }
                  }
                },
                actions.updateCreateTechlogEntryDialogData({
                  description: 'Some problem occurred',
                  status: { value: 'not_airworthy' }
                })
              )
            ).toEqual({
              createTechlogEntryDialog: {
                submitting: false,
                open: true,
                data: {
                  description: 'Some problem occurred',
                  status: { value: 'not_airworthy' }
                }
              }
            })
          })

          it('handles UPDATE_CREATE_TECHLOG_ENTRY_ACTION_DIALOG_DATA action', () => {
            expect(
              reducer(
                {
                  createTechlogEntryActionDialog: {
                    open: true,
                    submitting: false,
                    techlogEntryId: 'entry-1',
                    data: {
                      description: 'action xyz taken',
                      status: 'crs',
                      signature: null
                    }
                  }
                },
                actions.updateCreateTechlogEntryActionDialogData({
                  description: 'action xyz taken, and also action 123',
                  signature: 'XYZ-123'
                })
              )
            ).toEqual({
              createTechlogEntryActionDialog: {
                open: true,
                submitting: false,
                techlogEntryId: 'entry-1',
                data: {
                  description: 'action xyz taken, and also action 123',
                  status: 'crs',
                  signature: 'XYZ-123'
                }
              }
            })
          })

          describe('updateLandingTime', () => {
            it('does nothing if takeoff time not set', () => {
              const data = {
                counters: {
                  flightTimeCounter: {
                    start: 348967,
                    end: 349015
                  }
                }
              }

              updateLandingTime(data)

              expect(data).toEqual({
                counters: {
                  flightTimeCounter: {
                    start: 348967,
                    end: 349015
                  }
                }
              })
            })

            it('does nothing if start counter not set', () => {
              const data = {
                takeOffTime: '2018-12-15 10:30',
                counters: {
                  flightTimeCounter: {
                    end: 349015
                  }
                }
              }

              updateLandingTime(data)

              expect(data).toEqual({
                takeOffTime: '2018-12-15 10:30',
                counters: {
                  flightTimeCounter: {
                    end: 349015
                  }
                }
              })
            })

            it('does nothing if end counter not set', () => {
              const data = {
                takeOffTime: '2018-12-15 10:30',
                counters: {
                  flightTimeCounter: {
                    start: 348967
                  }
                }
              }

              updateLandingTime(data)

              expect(data).toEqual({
                takeOffTime: '2018-12-15 10:30',
                counters: {
                  flightTimeCounter: {
                    start: 348967
                  }
                }
              })
            })

            it('sets landing time if takeoff time, counters and aerodromes set', () => {
              const data = {
                takeOffTime: '2018-12-15 10:30',
                counters: {
                  flightTimeCounter: {
                    start: 348967,
                    end: 349015
                  }
                },
                departureAerodrome: {
                  timezone: 'Europe/London'
                },
                destinationAerodrome: {
                  timezone: 'Europe/Zurich'
                }
              }

              updateLandingTime(data)

              expect(data).toEqual({
                takeOffTime: '2018-12-15 10:30',
                landingTime: '2018-12-15 11:58',
                counters: {
                  flightTimeCounter: {
                    start: 348967,
                    end: 349015
                  }
                },
                departureAerodrome: {
                  timezone: 'Europe/London'
                },
                destinationAerodrome: {
                  timezone: 'Europe/Zurich'
                }
              })
            })

            it('sets landing time if takeoff time, counters and aerodromes set (start counter 0)', () => {
              const data = {
                takeOffTime: '2018-12-15 10:30',
                counters: {
                  flightTimeCounter: {
                    start: 0,
                    end: 100
                  }
                },
                departureAerodrome: {
                  timezone: 'Europe/London'
                },
                destinationAerodrome: {
                  timezone: 'Europe/Zurich'
                }
              }

              updateLandingTime(data)

              expect(data).toEqual({
                takeOffTime: '2018-12-15 10:30',
                landingTime: '2018-12-15 12:30',
                counters: {
                  flightTimeCounter: {
                    start: 0,
                    end: 100
                  }
                },
                departureAerodrome: {
                  timezone: 'Europe/London'
                },
                destinationAerodrome: {
                  timezone: 'Europe/Zurich'
                }
              })
            })
          })
        })
      })
    })
  })
})
