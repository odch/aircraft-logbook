const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getMemberByUid = require('../utils/getMemberByUid')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()

const addTechlogEntryAction = functions.https.onCall(async (data, context) => {
  const {
    organizationId,
    aircraftId,
    techlogEntryId,
    techlogEntryClosed,
    action
  } = data

  const member = await getMemberByUid(db, organizationId, context.auth.uid)

  if (!member.get('roles').includes('techlogmanager')) {
    throw new Error('User ' + context.auth.uid + 'is not a techlog manager')
  }

  action.timestamp = new Date()
  action.deleted = false
  action.author = {
    firstname: member.get('firstname'),
    lastname: member.get('lastname'),
    nr: member.get('nr') || null,
    member: member.ref,
    id: member.id
  }

  const batch = db.batch()

  const techlogEntryRef = db
    .collection('organizations')
    .doc(organizationId)
    .collection('aircrafts')
    .doc(aircraftId)
    .collection('techlog')
    .doc(techlogEntryId)

  const newActionRef = techlogEntryRef.collection('actions').doc()
  batch.set(newActionRef, action)

  batch.update(techlogEntryRef, {
    currentStatus: action.status,
    closed: techlogEntryClosed
  })

  await batch.commit()
})

exports.addTechlogEntryAction = addTechlogEntryAction
