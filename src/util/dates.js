import moment from 'moment'

export const formatDate = timestamp => moment(timestamp.toDate()).format('L')

export const formatTime = timestamp =>
  moment(timestamp.toDate()).format('HH:mm')

export const getTimeDiff = (startTimestamp, endTimestamp) => {
  const start = moment(startTimestamp.toDate())
  const end = moment(endTimestamp.toDate())
  const diff = end.diff(start)
  return moment.utc(diff).format('HH:mm')
}

/**
 * @param dateTime Date time string in a format MomentJS understands
 *                 (e.g. YYYY-MM-DD HH:mm)
 * @param hours Number of hours to add (can be a floating point number)
 * @returns {string} the new date time string in format YYYY-MM-DD HH:mm
 */
export const addHours = (dateTime, hours) =>
  moment(dateTime)
    .add(hours, 'hours')
    .format('YYYY-MM-DD HH:mm')

/**
 * Calculates the difference between two dates and returns hundredths of an hour.
 *
 * e.g. getTimeDiffInHundredthsOfHour('2018-11-20 10:00', '2018-11-20 11:00')
 *      -> returns 100
 *
 * @param start Date time string in a format MomentJS understands
 *              (e.g. YYYY-MM-DD HH:mm)
 * @param end Date time string in a format MomentJS understands
 *            (e.g. YYYY-MM-DD HH:mm)
 * @returns {Number} new difference between to timestamps in hundredths of an hour
 */
export const getTimeDiffInHundredthsOfHour = (start, end) => {
  const startMoment = moment(start)
  const endMoment = moment(end)
  const diff = endMoment.diff(startMoment)

  const hundredthsOfAnHour = millis2Hours(diff) * 100
  return Math.round(hundredthsOfAnHour)
}

const millis2Hours = millis => millis / (1000 * 60 * 60)
