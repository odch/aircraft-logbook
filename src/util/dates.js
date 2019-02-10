import moment from 'moment'

export const formatDate = timestamp => moment(timestamp.toDate()).format('L')

export const formatTime = timestamp =>
  moment(timestamp.toDate()).format('HH:mm')

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
