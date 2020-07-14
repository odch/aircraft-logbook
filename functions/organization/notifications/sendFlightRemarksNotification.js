const _get = require('lodash.get')
const nl2br = require('../../utils/nl2br')
const utils = require('./utils')

const getFlightFields = flightData => {
  const fields = [
    {
      paths: ['blockOffTime', 'departureAerodrome.timezone'],
      label: 'Datum',
      handler: utils.formatDate
    },
    {
      paths: ['blockOffTime', 'departureAerodrome.timezone'],
      label: 'Block off',
      handler: utils.formatTime
    },
    {
      paths: ['blockOnTime', 'destinationAerodrome.timezone'],
      label: 'Block on',
      handler: utils.formatTime
    },
    {
      paths: ['pilot.firstname', 'pilot.lastname'],
      label: 'Pilot',
      handler: utils.formatName
    },
    {
      paths: ['departureAerodrome.identification', 'departureAerodrome.name'],
      label: 'Startflugplatz',
      handler: utils.formatAerodrome
    },
    {
      paths: [
        'destinationAerodrome.identification',
        'destinationAerodrome.name'
      ],
      label: 'Zielflugplatz',
      handler: utils.formatAerodrome
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

  const receivers = await utils.collectReceivers(organizationRef, [
    ['roles', 'array-contains', 'manager'],
    ['notifications.flightRemarks', '==', true]
  ])
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

  return utils.sendNotificationMail(receivers, subject, html)
}

module.exports = sendFlightRemarksNotification
