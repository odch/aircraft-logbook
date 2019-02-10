import { formatDate, formatTime, addHours } from './dates'

describe('util', () => {
  describe('dates', () => {
    describe('formatDate', () => {
      it('should return a formatted date string', () => {
        const firestoreTimestamp = {
          toDate: () => Date.parse('2018-11-20 10:00')
        }
        expect(formatDate(firestoreTimestamp)).toEqual('20.11.2018')
      })
    })

    describe('formatTime', () => {
      it('should return a formatted time string', () => {
        const firestoreTimestamp = {
          toDate: () => Date.parse('2018-11-20 10:00')
        }
        expect(formatTime(firestoreTimestamp)).toEqual('10:00')
      })
    })

    describe('addHours', () => {
      it('should return a date time string with the hours added', () => {
        expect(addHours('2018-11-20 10:00', 2.1)).toEqual('2018-11-20 12:06')
      })
    })
  })
})
