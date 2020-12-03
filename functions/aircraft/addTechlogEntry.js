const admin = require('firebase-admin')
const addAttachments = require('./addAttachments')

const ALLOWED_USER_STATUS = [
  'for_information_only',
  'defect_aog',
  'defect_unknown'
]

const addTechlogEntry = async (
  organizationId,
  aircraftId,
  entry,
  member,
  aircraftRef,
  bucket,
  transaction
) => {
  if (entry.initialStatus !== entry.currentStatus) {
    throw new Error(
      `initialStatus '${entry.initialStatus}' is not equal to currentStatus '${entry.currentStatus}'`
    )
  }

  if (
    !member.get('roles').includes('techlogmanager') &&
    !ALLOWED_USER_STATUS.includes(entry.initialStatus)
  ) {
    throw new Error(
      `Status '${entry.initialStatus}' can only be set by techlogmanager`
    )
  }

  const author = {
    firstname: member.get('firstname'),
    lastname: member.get('lastname'),
    nr: member.get('nr') || null,
    member: member.ref,
    id: member.id
  }

  entry.timestamp = new Date()
  entry.deleted = false
  entry.author = author
  if (entry.closed === true) {
    entry.closedTimestamp = admin.firestore.FieldValue.serverTimestamp()
    entry.closedBy = author
  }

  const newEntryRef = aircraftRef.collection('techlog').doc()

  const aircraftDoc = await transaction.get(aircraftRef)

  if (aircraftDoc.exists !== true) {
    throw new Error(
      `Aircraft ${aircraftId} in organization ${organizationId} does not exist`
    )
  }

  const techlogEntriesCount = aircraftDoc.get('counters.techlogEntries') || 0
  const newCount = techlogEntriesCount + 1

  entry.number = newCount
  entry.attachments = await addAttachments(
    bucket,
    organizationId,
    aircraftId,
    newEntryRef.id,
    null,
    entry.attachments
  )

  await transaction.set(newEntryRef, entry)

  await transaction.update(aircraftRef, {
    'counters.techlogEntries': newCount
  })
}

module.exports = addTechlogEntry
