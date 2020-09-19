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

const deleteCheck = functions.https.onCall(async (data, context) => {
  const { organizationId, aircraftId, checkId } = data

  const member = await getMemberByUid(db, organizationId, context.auth.uid)

  requireRole(member, ['techlogmanager', 'manager'])

  const updateData = {
    deleted: true,
    deleteTimestamp: new Date(),
    deletedBy: {
      firstname: member.get('firstname'),
      lastname: member.get('lastname'),
      nr: member.get('nr') || null,
      member: member.ref,
      id: member.id
    }
  }

  db.collection('organizations')
    .doc(organizationId)
    .collection('aircrafts')
    .doc(aircraftId)
    .collection('checks')
    .doc(checkId)
    .update(updateData)
})

exports.deleteCheck = deleteCheck
