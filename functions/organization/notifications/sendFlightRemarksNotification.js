const _get = require('lodash.get')
const sendMail = require('../../utils/sendMail')
const dates = require('../../utils/dates')
const nl2br = require('../../utils/nl2br')

const formatDate = (date, timezone) => dates.formatDate(date, timezone)

const formatTime = (date, timezone) => dates.formatTime(date, timezone)

const formatPilot = (firstname, lastname) => `${firstname} ${lastname}`

const formatAerodrome = (identification, name) => `${identification} (${name})`

const getFlightFields = flightData => {
  const fields = [
    {
      paths: ['blockOffTime', 'departureAerodrome.timezone'],
      label: 'Datum',
      handler: formatDate
    },
    {
      paths: ['blockOffTime', 'departureAerodrome.timezone'],
      label: 'Block off',
      handler: formatTime
    },
    {
      paths: ['blockOnTime', 'destinationAerodrome.timezone'],
      label: 'Block on',
      handler: formatTime
    },
    {
      paths: ['pilot.firstname', 'pilot.lastname'],
      label: 'Pilot',
      handler: formatPilot
    },
    {
      paths: ['departureAerodrome.identification', 'departureAerodrome.name'],
      label: 'Startflugplatz',
      handler: formatAerodrome
    },
    {
      paths: [
        'destinationAerodrome.identification',
        'destinationAerodrome.name'
      ],
      label: 'Zielflugplatz',
      handler: formatAerodrome
    }
  ]

  const rowsHtml = fields
    .map(field => {
      const values = field.paths.map(path => _get(flightData, path))
      const outputValue = field.handler.apply(null, values)
      return `<tr><th style="text-align: left;">${field.label}</th><td>${outputValue}</td></tr>`
    })
    .join('\n')

  return `<table>${rowsHtml}</table>`
}

const collectReceivers = async organizationRef => {
  const querySnapshot = await organizationRef
    .collection('members')
    .where('roles', 'array-contains', 'manager')
    .where('notifications.flightRemarks', '==', true)
    .get()
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

const sendFlightRemarksNotification = async change => {
  const flightData = change.after.data()
  const previousFlightData = change.before.data()

  if (
    !flightData ||
    !flightData.remarks ||
    (previousFlightData && previousFlightData.remarks === flightData.remarks)
  ) {
    return null
  }

  const aircraftRef = change.after.ref.parent.parent
  const organizationRef = aircraftRef.parent.parent

  const receivers = await collectReceivers(organizationRef)
  if (receivers.length === 0) {
    return null
  }

  const orgName = organizationRef.id

  const aircraftDoc = await aircraftRef.get()
  const aircraftRegistration = await aircraftDoc.get('registration')

  const subjectPrefix = `${orgName} (${aircraftRegistration}):`

  const subject = !previousFlightData
    ? `${subjectPrefix} Neuer Flug mit Bemerkungen`
    : `${subjectPrefix} Bemerkungen geändert bei Flug`

  let remarks = `<p><strong>Bemerkungen:</strong><br><br>${nl2br(
    flightData.remarks
  )}</p>`
  if (previousFlightData) {
    remarks += `<p><strong>Bemerkungen vorher:</strong><br><br>${nl2br(
      previousFlightData.remarks
    )}</p>`
  }

  const flightFields = getFlightFields(flightData)

  const html = `<h1>${subject}</h1>
    ${remarks}
    ${flightFields}
  `

  return sendNotificationMail(receivers, subject, html)
}

module.exports = sendFlightRemarksNotification
