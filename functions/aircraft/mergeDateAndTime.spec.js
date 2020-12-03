const moment = require('moment-timezone')
const mergeDateAndTime = require('./mergeDateAndTime')

describe('aircraft', () => {
  describe('mergeDateAndTime', () => {
    it('should create a JS date for the given date and time string', () => {
      expect(
        mergeDateAndTime('2018-12-15', '2018-12-14 14:00', 'Europe/Zurich')
      ).toEqual(moment('2018-12-15T14:00+01').toDate())
    })
  })
})
