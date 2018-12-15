import * as actions from './actions'
import reducer from './reducer'

const INITIAL_STATE = {
  createFlightDialogOpen: false,
  createFlightDialogData: {
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
  },
  deleteFlightDialog: {
    open: false
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

          it('handles UPDATE_CREATE_FLIGHT_DIALOG_DATA action', () => {
            expect(
              reducer(
                {
                  createFlightDialogData: {
                    date: '2018-12-15',
                    blockOffTime: '2018-12-15 10:15',
                    counters: {
                      flightHours: {
                        start: 348967,
                        end: null
                      }
                    }
                  }
                },
                actions.updateCreateFlightDialogData({
                  'counters.flightHours.start': 348970,
                  blockOffTime: '2018-12-15 10:30'
                })
              )
            ).toEqual({
              createFlightDialogData: {
                date: '2018-12-15',
                blockOffTime: '2018-12-15 10:30',
                counters: {
                  flightHours: {
                    start: 348970,
                    end: null
                  }
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
