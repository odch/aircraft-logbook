const moment = require('moment-timezone')

moment.locale('de')

const formatDate = (timestamp, timezone) =>
  moment.tz(timestamp.toDate(), timezone).format('L')

const formatTime = (timestamp, timezone) =>
  moment.tz(timestamp.toDate(), timezone).format('HH:mm')

module.exports = {
  formatDate,
  formatTime
}
