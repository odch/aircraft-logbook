import {
  getOrganization,
  getAircraft,
  getAircraftFlights,
  getAircraftFlightsCount,
  getUserEmail
} from './getFromState'

describe('util', () => {
  describe('getFromState', () => {
    describe('getUserEmail', () => {
      it('should return undefined if auth not loaded', () => {
        expect(
          getUserEmail({
            firebase: {
              auth: {
                isLoaded: false
              }
            }
          })
        ).toEqual(undefined)
      })

      it('should return null if auth is empty', () => {
        expect(
          getUserEmail({
            firebase: {
              auth: {
                isLoaded: true,
                isEmpty: true
              }
            }
          })
        ).toEqual(null)
      })

      it('should return the email if auth is loaded and not empty', () => {
        expect(
          getUserEmail({
            firebase: {
              auth: {
                isLoaded: true,
                isEmpty: false,
                email: 'test@opendigital.ch'
              }
            }
          })
        ).toEqual('test@opendigital.ch')
      })
    })

    describe('getOrganization', () => {
      it('should return undefined if organizations map undefined', () => {
        // correspondends to the state where organizations haven't been loaded yet
        // --> `isLoaded` will return `true` for `undefined` values,
        //     which is what we want to achieve

        const state = {
          main: {
            app: {
              organizations: undefined
            }
          }
        }

        const organization = getOrganization(state, 'my_org')
        expect(organization).toEqual(undefined)
      })

      it('should return null if organizations map exists but organization is not found', () => {
        const state = {
          main: {
            app: {
              organizations: [{ id: 'some_org' }]
            }
          }
        }

        const organization = getOrganization(state, 'my_org')
        expect(organization).toEqual(null)
      })

      it('should return found organization', () => {
        const state = {
          main: {
            app: {
              organizations: [{ id: 'some_org' }, { id: 'my_org' }]
            }
          }
        }

        const organization = getOrganization(state, 'my_org')
        expect(organization).toEqual({
          id: 'my_org',
          roles: [],
          lockDate: null,
          expired: false
        })
      })

      it('should return found organization with expired set to true', () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        const state = {
          main: {
            app: {
              organizations: [
                { id: 'some_org' },
                {
                  id: 'my_org',
                  limits: {
                    expiration: yesterday
                  }
                }
              ]
            }
          }
        }

        const organization = getOrganization(state, 'my_org')
        expect(organization).toEqual({
          id: 'my_org',
          roles: [],
          lockDate: null,
          expired: true,
          limits: {
            expiration: yesterday
          }
        })
      })

      it('should return found organization with expired set to false', () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)

        const state = {
          main: {
            app: {
              organizations: [
                { id: 'some_org' },
                {
                  id: 'my_org',
                  limits: {
                    expiration: tomorrow
                  }
                }
              ]
            }
          }
        }

        const organization = getOrganization(state, 'my_org')
        expect(organization).toEqual({
          id: 'my_org',
          roles: [],
          lockDate: null,
          expired: false,
          limits: {
            expiration: tomorrow
          }
        })
      })
    })

    describe('getAircraft', () => {
      it('should return undefined if organizations aircrafts not loaded', () => {
        const state = {
          firestore: {
            data: {
              organizationAircrafts: undefined
            }
          }
        }

        const aircraft = getAircraft(state, 'o7flC7jw8jmkOfWo8oyA')
        expect(aircraft).toEqual(undefined)
      })

      it('should return null if aircrafts map exists but aircraft is not found', () => {
        const state = {
          firestore: {
            data: {
              organizationAircrafts: {
                BKi7HYAIoe1i75H3LMk1: {
                  registration: 'HBKFW'
                }
              }
            }
          }
        }

        const aircraft = getAircraft(state, 'o7flC7jw8jmkOfWo8oyA')
        expect(aircraft).toEqual(null)
      })

      it('should return found aircraft with default counters', () => {
        const state = {
          firebase: {
            profile: {
              selectedOrganization: 'org_id'
            }
          },
          main: {
            app: {
              organizations: [{ id: 'org_id' }]
            }
          },
          firestore: {
            data: {
              organizationAircrafts: {
                BKi7HYAIoe1i75H3LMk1: {
                  registration: 'HBKFW'
                },
                o7flC7jw8jmkOfWo8oyA: {
                  registration: 'HBKLA'
                }
              }
            }
          }
        }

        const aircraft = getAircraft(state, 'o7flC7jw8jmkOfWo8oyA')
        expect(aircraft).toEqual({
          id: 'o7flC7jw8jmkOfWo8oyA',
          registration: 'HBKLA',
          counters: {
            flights: 0,
            landings: 0,
            flightHours: 0,
            techlogEntries: 0,
            flightsTotal: 0
          },
          settings: {
            engineHoursCounterEnabled: false,
            engineHoursCounterFractionDigits: undefined,
            engineTachHoursCounterEnabled: false,
            engineTachHoursCounterFractionDigits: undefined,
            flightTimeCounterEnabled: false,
            flightTimeCounterFractionDigits: undefined,
            fuelTypes: [],
            lockDate: null,
            techlogEnabled: false,
            techlogSignatureEnabled: false
          }
        })
      })

      it('should return found aircraft with counters from latest flight', () => {
        const state = {
          firebase: {
            profile: {
              selectedOrganization: 'org_id'
            }
          },
          main: {
            app: {
              organizations: [{ id: 'org_id' }]
            }
          },
          firestore: {
            data: {
              organizationAircrafts: {
                o7flC7jw8jmkOfWo8oyA: {
                  registration: 'HBKLA'
                }
              }
            },
            ordered: {
              'flights-o7flC7jw8jmkOfWo8oyA-0': [
                {
                  counters: {
                    flights: { end: 1 },
                    landings: { end: 3 },
                    flightHours: { end: 120 }
                  }
                }
              ]
            }
          }
        }

        const aircraft = getAircraft(state, 'o7flC7jw8jmkOfWo8oyA')
        expect(aircraft).toEqual({
          id: 'o7flC7jw8jmkOfWo8oyA',
          registration: 'HBKLA',
          counters: {
            flights: 1,
            landings: 3,
            flightHours: 120,
            techlogEntries: 0,
            flightsTotal: 0
          },
          settings: {
            engineHoursCounterEnabled: false,
            engineHoursCounterFractionDigits: undefined,
            engineTachHoursCounterEnabled: false,
            engineTachHoursCounterFractionDigits: undefined,
            flightTimeCounterEnabled: false,
            flightTimeCounterFractionDigits: undefined,
            fuelTypes: [],
            lockDate: null,
            techlogEnabled: false,
            techlogSignatureEnabled: false
          }
        })
      })

      it('should return found aircraft with start counters from latest flight if preflight', () => {
        const state = {
          firebase: {
            profile: {
              selectedOrganization: 'org_id'
            }
          },
          main: {
            app: {
              organizations: [{ id: 'org_id' }]
            }
          },
          firestore: {
            data: {
              organizationAircrafts: {
                o7flC7jw8jmkOfWo8oyA: {
                  registration: 'HBKLA'
                }
              }
            },
            ordered: {
              'flights-o7flC7jw8jmkOfWo8oyA-0': [
                {
                  counters: {
                    flights: { start: 1 },
                    landings: { start: 3 },
                    flightHours: { start: 120 }
                  }
                }
              ]
            }
          }
        }

        const aircraft = getAircraft(state, 'o7flC7jw8jmkOfWo8oyA')
        expect(aircraft).toEqual({
          id: 'o7flC7jw8jmkOfWo8oyA',
          registration: 'HBKLA',
          counters: {
            flights: 1,
            landings: 3,
            flightHours: 120,
            techlogEntries: 0,
            flightsTotal: 0
          },
          settings: {
            engineHoursCounterEnabled: false,
            engineHoursCounterFractionDigits: undefined,
            engineTachHoursCounterEnabled: false,
            engineTachHoursCounterFractionDigits: undefined,
            flightTimeCounterEnabled: false,
            flightTimeCounterFractionDigits: undefined,
            fuelTypes: [],
            lockDate: null,
            techlogEnabled: false,
            techlogSignatureEnabled: false
          }
        })
      })

      it('should return techlog entries and total flights count from aircraft counters object', () => {
        const state = {
          firebase: {
            profile: {
              selectedOrganization: 'org_id'
            }
          },
          main: {
            app: {
              organizations: [{ id: 'org_id' }]
            }
          },
          firestore: {
            data: {
              organizationAircrafts: {
                o7flC7jw8jmkOfWo8oyA: {
                  registration: 'HBKLA',
                  counters: {
                    techlogEntries: 32,
                    flightsTotal: 98
                  }
                }
              }
            },
            ordered: {
              'flights-o7flC7jw8jmkOfWo8oyA-0': [
                {
                  counters: {
                    flights: { end: 1 },
                    landings: { end: 3 },
                    flightHours: { end: 120 }
                  }
                }
              ]
            }
          }
        }

        const aircraft = getAircraft(state, 'o7flC7jw8jmkOfWo8oyA')
        expect(aircraft).toEqual({
          id: 'o7flC7jw8jmkOfWo8oyA',
          registration: 'HBKLA',
          counters: {
            flights: 1,
            landings: 3,
            flightHours: 120,
            techlogEntries: 32,
            flightsTotal: 98
          },
          settings: {
            engineHoursCounterEnabled: false,
            engineHoursCounterFractionDigits: undefined,
            engineTachHoursCounterEnabled: false,
            engineTachHoursCounterFractionDigits: undefined,
            flightTimeCounterEnabled: false,
            flightTimeCounterFractionDigits: undefined,
            fuelTypes: [],
            lockDate: null,
            techlogEnabled: false,
            techlogSignatureEnabled: false
          }
        })
      })
    })

    describe('getAircraftFlights', () => {
      it('should return undefined if flights not loaded', () => {
        const state = {
          firestore: {
            ordered: {}
          }
        }

        const flights = getAircraftFlights(state, 'o7flC7jw8jmkOfWo8oyA', 0)
        expect(flights).toEqual(undefined)
      })

      it('should return undefined if references are not yet populated', () => {
        const state = {
          firestore: {
            ordered: {
              'flights-o7flC7jw8jmkOfWo8oyA-0': [
                {
                  departureAerodrome: {} // represents a reference, not populated
                }
              ]
            }
          }
        }

        const flights = getAircraftFlights(state, 'o7flC7jw8jmkOfWo8oyA', 0)
        expect(flights).toEqual(undefined)
      })

      it('should return flights if references are populated', () => {
        const state = {
          firestore: {
            ordered: {
              'flights-o7flC7jw8jmkOfWo8oyA-0': [
                {
                  departureAerodrome: {
                    name: 'Lommis'
                  }
                }
              ]
            }
          }
        }

        const flights = getAircraftFlights(state, 'o7flC7jw8jmkOfWo8oyA', 0)
        expect(flights).toEqual([
          {
            departureAerodrome: {
              name: 'Lommis'
            }
          }
        ])
      })

      it('should return empty array if array is empty', () => {
        const state = {
          firestore: {
            ordered: {
              'flights-o7flC7jw8jmkOfWo8oyA-0': []
            }
          }
        }

        const flights = getAircraftFlights(state, 'o7flC7jw8jmkOfWo8oyA', 0)
        expect(flights).toEqual([])
      })
    })

    describe('getAircraftFlightsCount', () => {
      it('should return fights end counter of last flight', () => {
        const state = {
          firestore: {
            ordered: {
              'flights-o7flC7jw8jmkOfWo8oyA-0': [
                {
                  counters: {
                    flights: { end: 4 },
                    landings: { end: 9 },
                    flightHours: { end: 400 }
                  }
                },
                {
                  counters: {
                    flights: { end: 3 },
                    landings: { end: 4 },
                    flightHours: { end: 300 }
                  }
                }
              ],
              'flights-o7flC7jw8jmkOfWo8oyA-1': [
                {
                  counters: {
                    flights: { end: 2 },
                    landings: { end: 4 },
                    flightHours: { end: 200 }
                  }
                },
                {
                  counters: {
                    flights: { end: 1 },
                    landings: { end: 1 },
                    flightHours: { end: 100 }
                  }
                }
              ]
            }
          }
        }

        const count = getAircraftFlightsCount(state, 'o7flC7jw8jmkOfWo8oyA')
        expect(count).toEqual(4)
      })

      it('should return 0 if flights not loaded', () => {
        const state = {
          firestore: {
            ordered: {}
          }
        }

        const count = getAircraftFlightsCount(state, 'o7flC7jw8jmkOfWo8oyA')
        expect(count).toEqual(0)
      })

      it('should return 0 if it has no flights', () => {
        const state = {
          firestore: {
            ordered: {
              'flights-o7flC7jw8jmkOfWo8oyA-0': []
            }
          }
        }

        const count = getAircraftFlightsCount(state, 'o7flC7jw8jmkOfWo8oyA')
        expect(count).toEqual(0)
      })
    })
  })
})
