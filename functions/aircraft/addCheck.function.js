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

const addCheck = functions.https.onCall(async (data, context) => {
  const { organizationId, aircraftId, check } = data

  const member = await getMemberByUid(db, organizationId, context.auth.uid)

  requireRole(member, ['techlogmanager', 'manager'])

  if (check.dateLimit) {
    check.dateLimit = new Date(check.dateLimit)
  }
  check.createTimestamp = new Date()
  check.deleted = false
  check.owner = {
    firstname: member.get('firstname'),
    lastname: member.get('lastname'),
    nr: member.get('nr') || null,
    member: member.ref,
    id: member.id
  }

  db.collection('organizations')
    .doc(organizationId)
    .collection('aircrafts')
    .doc(aircraftId)
    .collection('checks')
    .doc()
    .set(check)
})

exports.addCheck = addCheck
