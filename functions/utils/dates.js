const moment = require('moment-timezone')

const formatDate = (timestamp, timezone) =>
  moment.tz(timestamp.toDate(), timezone).format('DD.MM.YYYY')

const formatTime = (timestamp, timezone) =>
  moment.tz(timestamp.toDate(), timezone).format('HH:mm')

module.exports = {
  formatDate,
  formatTime
}
