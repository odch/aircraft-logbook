import { formatDate, formatTime, addHours, getTimeDiff } from './dates'

describe('util', () => {
  describe('dates', () => {
    describe('formatDate', () => {
      it('should return a formatted date string', () => {
        const firestoreTimestamp = {
          toDate: () => Date.parse('2018-11-20 10:00 GMT+0100')
        }
        expect(formatDate(firestoreTimestamp, 'Europe/Zurich)')).toEqual(
          '20.11.2018'
        )
      })
    })

    describe('formatTime', () => {
      it('should return a formatted time string', () => {
        const firestoreTimestamp = {
          toDate: () => Date.parse('2018-11-20 10:00 GMT+0100')
        }
        expect(formatTime(firestoreTimestamp, 'Europe/Zurich')).toEqual('10:00')
      })
    })

    describe('getTimeDiff', () => {
      it('should return a formatted time diff string', () => {
        const startTimestamp = {
          toDate: () => Date.parse('2018-11-20 10:00')
        }
        const endTimestamp = {
          toDate: () => Date.parse('2018-11-20 11:15')
        }
        expect(getTimeDiff(startTimestamp, endTimestamp)).toEqual('01:15')
      })
    })

    describe('addHours', () => {
      it('should return a date time string with the hours added (same tz)', () => {
        expect(
          addHours('2018-11-20 10:00', 2.1, 'Europe/Zurich', 'Europe/Zurich')
        ).toEqual('2018-11-20 12:06')
      })

      it('should return a date time string with the hours added (different tz)', () => {
        expect(
          addHours('2018-11-20 10:00', 2.1, 'Europe/Zurich', 'Europe/Athens')
        ).toEqual('2018-11-20 13:06')
      })
    })
  })
})
