import {
  getOrganization,
  getAircraft,
  getAircraftFlights
} from './getFromState'

describe('util', () => {
  describe('getFromState', () => {
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
          id: 'my_org'
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

      it('should return found aircraft', () => {
        const state = {
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
          registration: 'HBKLA'
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

        const flights = getAircraftFlights(state, 'o7flC7jw8jmkOfWo8oyA')
        expect(flights).toEqual(undefined)
      })

      it('should return undefined if references are not yet populated', () => {
        const state = {
          firestore: {
            ordered: {
              'flights-o7flC7jw8jmkOfWo8oyA': [
                {
                  departureAerodrome: {} // represents a reference, not populated
                }
              ]
            }
          }
        }

        const flights = getAircraftFlights(state, 'o7flC7jw8jmkOfWo8oyA')
        expect(flights).toEqual(undefined)
      })

      it('should return flights if references are populated', () => {
        const state = {
          firestore: {
            ordered: {
              'flights-o7flC7jw8jmkOfWo8oyA': [
                {
                  departureAerodrome: {
                    name: 'Lommis'
                  }
                }
              ]
            }
          }
        }

        const flights = getAircraftFlights(state, 'o7flC7jw8jmkOfWo8oyA')
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
              'flights-o7flC7jw8jmkOfWo8oyA': []
            }
          }
        }

        const flights = getAircraftFlights(state, 'o7flC7jw8jmkOfWo8oyA')
        expect(flights).toEqual([])
      })
    })
  })
})
