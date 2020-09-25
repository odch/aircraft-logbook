import * as techlogStatus from './techlogStatus'

describe('util', () => {
  describe('techlogStatus', () => {
    describe('getTechlogStatus', () => {
      it('should return all status if techlog manager', () => {
        expect(techlogStatus.getTechlogStatus(true)).toEqual([
          { id: 'for_information_only', closed: false, requiresManager: false },
          { id: 'defect_aog', closed: false, requiresManager: false },
          { id: 'defect_unknown', closed: false, requiresManager: false },
          {
            id: 'defect_with_limitations',
            closed: false,
            requiresManager: true
          },
          {
            id: 'defect_not_flight_relevant',
            closed: false,
            requiresManager: true
          },
          { id: 'closed', closed: true, requiresManager: true },
          { id: 'crs', closed: true, requiresManager: true },
          { id: 'arc', closed: true, requiresManager: true }
        ])
      })

      it('should return only certain status if not techlog manager', () => {
        expect(techlogStatus.getTechlogStatus(false)).toEqual([
          { id: 'for_information_only', closed: false, requiresManager: false },
          { id: 'defect_aog', closed: false, requiresManager: false },
          { id: 'defect_unknown', closed: false, requiresManager: false }
        ])
      })
    })

    describe('isClosed', () => {
      it('should return true if it is a closed status', () => {
        expect(techlogStatus.isClosed('closed')).toEqual(true)
      })

      it('should return false if it is not a closed status', () => {
        expect(techlogStatus.isClosed('defect_aog')).toEqual(false)
      })

      it('should throw an error if the status is unknown', () => {
        expect(() => techlogStatus.isClosed('some_unknown_status')).toThrow(
          'Status some_unknown_status not found'
        )
      })
    })
  })
})
