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
    page: 0,
    rowsPerPage: 10
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
