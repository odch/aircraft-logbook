import {
  formatDate,
  formatTime,
  addHours,
  getTimeDiff,
  getTimeDiffInHundredthsOfHour
} from './dates'

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
      it('should return a date time string with the hours added', () => {
        expect(addHours('2018-11-20 10:00', 2.1)).toEqual('2018-11-20 12:06')
      })
    })

    describe('getTimeDiffInHundredthsOfHour', () => {
      it('should return the difference between two timestamps in hundredths of an hour', () => {
        expect(
          getTimeDiffInHundredthsOfHour('2018-11-20 10:00', '2018-11-20 11:00')
        ).toEqual(100)
      })

      it('should round to integers', () => {
        expect(
          getTimeDiffInHundredthsOfHour('2018-11-20 10:00', '2018-11-20 10:01')
        ).toEqual(2)
      })

      it('should return 0 if timestamps are equal', () => {
        expect(
          getTimeDiffInHundredthsOfHour('2018-11-20 10:00', '2018-11-20 10:00')
        ).toEqual(0)
      })

      it('should return negative numbers if start timestamp is after end timestamp', () => {
        expect(
          getTimeDiffInHundredthsOfHour('2018-11-20 10:00', '2018-11-20 09:30')
        ).toEqual(-50)
      })
    })
  })
})
