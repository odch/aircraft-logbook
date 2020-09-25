const nl2br = require('../../utils/nl2br')
const utils = require('./utils')

const statusLabels = {
  for_information_only: 'For information only',
  defect_aog: 'Defect (not airworthy)',
  defect_unknown: 'Defect (implications unknown)',
  defect_not_flight_relevant: 'Defect (not flight relevant)',
  defect_with_limitations: 'Defect (airworthy with limitations)',
  closed: 'Closed',
  crs: 'CRS',
  arc: 'ARC'
}

const sendTechlogCreationNotification = async techlogEntryDoc => {
  const techlogEntryData = techlogEntryDoc.data()

  const aircraftRef = techlogEntryDoc.ref.parent.parent
  const organizationRef = aircraftRef.parent.parent

  const receivers = await utils.collectReceivers(organizationRef, [
    ['roles', 'array-contains-any', ['manager', 'techlogmanager']],
    ['notifications.techlogEntryCreation', '==', true]
  ])
  if (receivers.length === 0) {
    return null
  }

  const orgName = organizationRef.id

  const aircraftDoc = await aircraftRef.get()
  const aircraftRegistration = await aircraftDoc.get('registration')

  const subjectPrefix = `${orgName} (${aircraftRegistration}):`

  const subject = `${subjectPrefix} Neuer Techlog-Eintrag`

  const html = `<h1>${subject}</h1>
    <p><strong>Erfasser:</strong> ${utils.formatName(
      techlogEntryData.author.firstname,
      techlogEntryData.author.lastname
    )}<br><strong>Status:</strong> ${
    statusLabels[techlogEntryData.initialStatus]
  }<br><strong>Beschreibung:</strong><br>${nl2br(
    techlogEntryData.description
  )}</p>
  `

  return utils.sendNotificationMail(receivers, subject, html)
}

module.exports = sendTechlogCreationNotification
