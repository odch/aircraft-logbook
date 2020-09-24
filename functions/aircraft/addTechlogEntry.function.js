const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getMemberByUid = require('../utils/getMemberByUid')
const addAttachments = require('./addAttachments')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const ALLOWED_USER_STATUS = [
  'for_information_only',
  'defect_aog',
  'defect_unknown'
]

const db = admin.firestore()
const bucket = admin.storage().bucket()

const addTechlogEntry = functions.https.onCall(async (data, context) => {
  const { organizationId, aircraftId, entry } = data

  const member = await getMemberByUid(db, organizationId, context.auth.uid)

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

  entry.timestamp = new Date()
  entry.deleted = false
  entry.author = {
    firstname: member.get('firstname'),
    lastname: member.get('lastname'),
    nr: member.get('nr') || null,
    member: member.ref,
    id: member.id
  }

  const batch = db.batch()

  const aircraftRef = db
    .collection('organizations')
    .doc(organizationId)
    .collection('aircrafts')
    .doc(aircraftId)

  const newEntryRef = aircraftRef.collection('techlog').doc()

  entry.attachments = await addAttachments(
    bucket,
    organizationId,
    aircraftId,
    newEntryRef.id,
    null,
    entry.attachments
  )

  batch.set(newEntryRef, entry)

  batch.update(aircraftRef, {
    'counters.techlogEntries': admin.firestore.FieldValue.increment(1)
  })

  await batch.commit()
})

exports.addTechlogEntry = addTechlogEntry
