import moment from 'moment-timezone'

/**
 * @param timestamp The Firestore timestamp to format
 * @param timezone The timezone to format the timestamp in (default is the current tz of the user)
 * @returns the formatted date in the current MomentJS locale (without time)
 */
export const formatDate = (timestamp, timezone = moment.tz.guess()) =>
  moment(timestamp.toDate()).tz(timezone).format('DD.MM.YYYY')

/**
 * @param timestamp The Firestore timestamp to calculate the duration to
 * @param timezone The timezone of the timestamp and to use for the current date
 * @returns the human-readable duration from or to the given date
 * {{past: boolean (true, if the given date is in the past), text: string}}
 */
export const humanDurationUntilDate = (
  timestamp,
  timezone = moment.tz.guess()
) => {
  const endMoment = moment(timestamp.toDate()).tz(timezone)
  const today = moment().tz(timezone)
  const duration = moment.duration(endMoment.diff(today))
  const text = duration.humanize()

  const timestampIsInPast = endMoment.isBefore(today)

  return {
    text,
    past: timestampIsInPast
  }
}

/**
 * @param timestamp The Firestore timestamp to format
 * @param timezone The timezone to format the timestamp in (default is the current tz of the user)
 * @returns the time in the format 'HH:mm'
 */
export const formatTime = (timestamp, timezone = moment.tz.guess()) =>
  moment(timestamp.toDate()).tz(timezone).format('HH:mm')

export const getTimeDiff = (startTimestamp, endTimestamp) => {
  const start = moment(startTimestamp.toDate())
  const end = moment(endTimestamp.toDate())
  const diff = end.diff(start)
  return moment.utc(diff).format('HH:mm')
}

/**
 * @param dateTime Date time string in a format MomentJS understands
 *                 (e.g. YYYY-MM-DD HH:mm)
 * @param timezone The timezone of the date time
 * @param comparisonDateTime Date time string in a format MomentJS understands that
 *                           the first date time should be compared with
 * @param comparisonTimezone The timezone of the comparison date time
 * @returns {boolean} true if the first date time is before the comparison date
 *                    time, otherwise false.
 */
export const isBefore = (
  dateTime,
  timezone,
  comparisonDateTime,
  comparisonTimezone
) =>
  moment
    .tz(dateTime, timezone)
    .isBefore(moment.tz(comparisonDateTime, comparisonTimezone))

/**
 * @param dateTime Date time string in a format MomentJS understands
 *                 (e.g. YYYY-MM-DD HH:mm)
 * @param hours Number of hours to add (can be a floating point number)
 * @returns {string} the new date time string in format YYYY-MM-DD HH:mm
 */
export const addHours = (dateTime, hours, initialTimezone, targetTimezone) =>
  moment
    .tz(dateTime, initialTimezone)
    .add(hours, 'hours')
    .tz(targetTimezone)
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
