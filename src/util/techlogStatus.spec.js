import * as techlogStatus from './techlogStatus'

describe('util', () => {
  describe('techlogStatus', () => {
    describe('getTechlogStatus', () => {
      it('should return all status if techlog manager', () => {
        expect(techlogStatus.getTechlogStatus(true)).toEqual([
          { id: 'for_information_only', closed: false },
          { id: 'not_airworthy', closed: false },
          { id: 'not_flight_relevant', closed: false },
          { id: 'closed', closed: true },
          { id: 'crs', closed: true },
          { id: 'crs_check', closed: true },
          { id: 'annual_review', closed: true }
        ])
      })

      it('should return only unclosed if not techlog manager', () => {
        expect(techlogStatus.getTechlogStatus(false)).toEqual([
          { id: 'for_information_only', closed: false },
          { id: 'not_airworthy', closed: false },
          { id: 'not_flight_relevant', closed: false }
        ])
      })
    })

    describe('isClosed', () => {
      it('should return true if it is a closed status', () => {
        expect(techlogStatus.isClosed('closed')).toEqual(true)
      })

      it('should return false if it is not a closed status', () => {
        expect(techlogStatus.isClosed('not_airworthy')).toEqual(false)
      })

      it('should throw an error if the status is unknown', () => {
        expect(() => techlogStatus.isClosed('some_unknown_status')).toThrow(
          'Status some_unknown_status not found'
        )
      })
    })
  })
})
