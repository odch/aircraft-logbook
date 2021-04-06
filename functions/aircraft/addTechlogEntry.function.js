const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getMemberByUid = require('../utils/getMemberByUid')
const checkNotExpired = require('../utils/checkNotExpired')
const addEntry = require('./addTechlogEntry')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()
const bucket = admin.storage().bucket()

const addTechlogEntry = functions.https.onCall(async (data, context) => {
  const { organizationId, aircraftId, entry } = data
  await checkNotExpired(db, organizationId)
  const member = await getMemberByUid(db, data.organizationId, context.auth.uid)
  const aircraftRef = db
    .collection('organizations')
    .doc(organizationId)
    .collection('aircrafts')
    .doc(aircraftId)
  await db.runTransaction(async transaction => {
    await addEntry(
      organizationId,
      aircraftId,
      entry,
      member,
      aircraftRef,
      bucket,
      transaction
    )
  })
})

exports.addTechlogEntry = addTechlogEntry
