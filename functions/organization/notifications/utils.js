const sendMail = require('../../utils/sendMail')
const dates = require('../../utils/dates')

const formatDate = (date, timezone) => dates.formatDate(date, timezone)

const formatTime = (date, timezone) => dates.formatTime(date, timezone)

const formatName = (firstname, lastname) => `${firstname} ${lastname}`

const formatAerodrome = (identification, name) => `${identification} (${name})`

const collectReceivers = async (organizationRef, conditions) => {
  let query = organizationRef.collection('members')
  for (const condition of conditions) {
    query = query.where(condition[0], condition[1], condition[2])
  }
  const querySnapshot = await query.get()
  return querySnapshot.docs
    .map(doc => doc.get('inviteEmail'))
    .filter(mail => !!mail)
}

const sendNotificationMail = async (receivers, subject, html) => {
  const mailPromises = receivers.map(receiver => {
    console.log(`Sending notification mail to ${receiver}`)
    return sendMail(receiver, subject, html)
  })
  return Promise.all(mailPromises)
}

module.exports = {
  formatDate,
  formatTime,
  formatName,
  formatAerodrome,
  collectReceivers,
  sendNotificationMail
}
