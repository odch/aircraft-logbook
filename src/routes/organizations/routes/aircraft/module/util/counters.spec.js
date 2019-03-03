import { getCounters } from './counters'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('util', () => {
          describe('counters', () => {
            describe('getCounters', () => {
              it('should set end counters from data', () => {
                const data = {
                  landings: 1,
                  blockOffTime: '2019-03-01 10:00',
                  blockOnTime: '2019-03-01 11:00',
                  takeOffTime: '2019-03-01 10:05',
                  landingTime: '2019-03-01 10:55',
                  counters: {
                    flights: {
                      start: 12
                    },
                    landings: {
                      start: 25
                    },
                    blockHours: {
                      start: 1035
                    },
                    flightHours: {
                      start: 947
                    }
                  }
                }

                const counters = getCounters(data)

                expect(counters).toEqual({
                  blockHours: {
                    start: 1035,
                    end: 1135
                  },
                  flightHours: {
                    start: 947,
                    end: 1030
                  },
                  flights: {
                    start: 12,
                    end: 13
                  },
                  landings: {
                    start: 25,
                    end: 26
                  }
                })
              })

              it('should throw error if counters property is missing', () => {
                const data = {}
                expect(() => getCounters(data)).toThrow(
                  'Counters property missing'
                )
              })

              it('should throw error if property counters.flights.start is missing', () => {
                const data = {
                  counters: {}
                }
                expect(() => getCounters(data)).toThrow(
                  'Property `counters.flights.start` missing or not a number'
                )
              })

              it('should throw error if property counters.landings.start is missing', () => {
                const data = {
                  counters: {
                    flights: {
                      start: 12
                    }
                  }
                }
                expect(() => getCounters(data)).toThrow(
                  'Property `counters.landings.start` missing or not a number'
                )
              })

              it('should throw error if property counters.blockHours.start is missing', () => {
                const data = {
                  counters: {
                    flights: {
                      start: 12
                    },
                    landings: {
                      start: 25
                    }
                  }
                }
                expect(() => getCounters(data)).toThrow(
                  'Property `counters.blockHours.start` missing or not a number'
                )
              })

              it('should throw error if property counters.flightHours.start is missing', () => {
                const data = {
                  counters: {
                    flights: {
                      start: 12
                    },
                    landings: {
                      start: 25
                    },
                    blockHours: {
                      start: 1035
                    }
                  }
                }
                expect(() => getCounters(data)).toThrow(
                  'Property `counters.flightHours.start` missing or not a number'
                )
              })

              it('should throw error if property landings is missing', () => {
                const data = {
                  counters: {
                    flights: {
                      start: 12
                    },
                    landings: {
                      start: 25
                    },
                    blockHours: {
                      start: 1035
                    },
                    flightHours: {
                      start: 947
                    }
                  }
                }
                expect(() => getCounters(data)).toThrow(
                  'Property `landings` missing or not a number'
                )
              })

              it('should throw error if property blockOffTime is missing', () => {
                const data = {
                  landings: 1,
                  counters: {
                    flights: {
                      start: 12
                    },
                    landings: {
                      start: 25
                    },
                    blockHours: {
                      start: 1035
                    },
                    flightHours: {
                      start: 947
                    }
                  }
                }
                expect(() => getCounters(data)).toThrow(
                  'Property `blockOffTime` missing or not a string'
                )
              })

              it('should throw error if property blockOnTime is missing', () => {
                const data = {
                  landings: 1,
                  blockOffTime: '2019-03-01 10:00',
                  counters: {
                    flights: {
                      start: 12
                    },
                    landings: {
                      start: 25
                    },
                    blockHours: {
                      start: 1035
                    },
                    flightHours: {
                      start: 947
                    }
                  }
                }
                expect(() => getCounters(data)).toThrow(
                  'Property `blockOnTime` missing or not a string'
                )
              })

              it('should throw error if property takeOffTime is missing', () => {
                const data = {
                  landings: 1,
                  blockOffTime: '2019-03-01 10:00',
                  blockOnTime: '2019-03-01 11:00',
                  counters: {
                    flights: {
                      start: 12
                    },
                    landings: {
                      start: 25
                    },
                    blockHours: {
                      start: 1035
                    },
                    flightHours: {
                      start: 947
                    }
                  }
                }
                expect(() => getCounters(data)).toThrow(
                  'Property `takeOffTime` missing or not a string'
                )
              })

              it('should throw error if property landingTime is missing', () => {
                const data = {
                  landings: 1,
                  blockOffTime: '2019-03-01 10:00',
                  blockOnTime: '2019-03-01 11:00',
                  takeOffTime: '2019-03-01 10:05',
                  counters: {
                    flights: {
                      start: 12
                    },
                    landings: {
                      start: 25
                    },
                    blockHours: {
                      start: 1035
                    },
                    flightHours: {
                      start: 947
                    }
                  }
                }
                expect(() => getCounters(data)).toThrow(
                  'Property `landingTime` missing or not a string'
                )
              })
            })
          })
        })
      })
    })
  })
})
