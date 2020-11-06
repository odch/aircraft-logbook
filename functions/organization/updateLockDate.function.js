const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getMemberByUid = require('../utils/getMemberByUid')
const requireRole = require('../utils/requireRole')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()

const updateLockDate = functions.https.onCall(async (data, context) => {
  const { organizationId, date } = data

  const member = await getMemberByUid(db, organizationId, context.auth.uid)

  requireRole(member, ['manager'])

  const dateObj = date ? new Date(date) : null

  await db.runTransaction(async t => {
    const orgRef = db.collection('organizations').doc(organizationId)
    const aircraftRefs = await t.get(orgRef.collection('aircrafts'))

    await t.update(orgRef, {
      lockDate: dateObj
    })
    await Promise.all(
      aircraftRefs.docs.map(aircraftDoc =>
        t.update(aircraftDoc.ref, {
          'settings.lockDate': dateObj
        })
      )
    )
  })
})

exports.updateLockDate = updateLockDate
