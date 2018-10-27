import isLoaded from './isLoaded'

describe('util', () => {
  describe('isLoaded', () => {
    it('returns false if the value is undefined', () => {
      expect(isLoaded(undefined)).toBe(false)
    })

    it('returns true if the value is null', () => {
      expect(isLoaded(null)).toBe(true)
    })

    it('returns true if the value is defined', () => {
      expect(isLoaded(0)).toBe(true)
    })
  })
})
