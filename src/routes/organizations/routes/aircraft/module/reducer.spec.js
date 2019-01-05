import * as actions from './actions'
import reducer from './reducer'

const INITIAL_STATE = {
  createFlightDialog: {
    open: false,
    data: {
      initialized: false,
      date: null,
      pilot: null,
      blockOffTime: null,
      takeOffTime: null,
      landingTime: null,
      blockOnTime: null,
      counters: {
        flightHours: {
          start: null,
          end: null
        }
      }
    }
  },
  deleteFlightDialog: {
    open: false
  },
  flights: {
    page: 0
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
                    page: 1
                  }
                },
                actions.setFlightsPage(2)
              )
            ).toEqual({
              flights: {
                page: 2
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
                        flightHours: {
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
                  'counters.flightHours.start': 348970,
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
                    flightHours: {
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

          it('handles SET_FLIGHT_VALIDATION_ERRORS action', () => {
            expect(
              reducer(
                {
                  createFlightDialog: {
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
        })
      })
    })
  })
})
