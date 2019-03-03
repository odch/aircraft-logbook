import getMissingFields from './getMissingFields'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('util', () => {
          describe('getMissingFields', () => {
            it('should return empty array if required field array empty', () => {
              expect(getMissingFields({}, [])).toEqual([])
            })

            it('should return array with missing field', () => {
              expect(getMissingFields({}, ['pilot'])).toEqual(['pilot'])
            })

            it('should return array with missing nested field', () => {
              expect(
                getMissingFields(
                  {
                    counters: {
                      flights: {
                        start: 34
                      },
                      landings: {}
                    }
                  },
                  ['counters.flights.start', 'counters.landings.start']
                )
              ).toEqual(['counters.landings.start'])
            })

            it('should return array with multiple missing fields', () => {
              expect(
                getMissingFields(
                  {
                    counters: {
                      flights: {
                        start: 34
                      },
                      landings: {},
                      blockHours: {}
                    }
                  },
                  [
                    'counters.flights.start',
                    'counters.landings.start',
                    'counters.blockHours.start'
                  ]
                )
              ).toEqual([
                'counters.landings.start',
                'counters.blockHours.start'
              ])
            })
          })
        })
      })
    })
  })
})
