const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getMemberByUid = require('../utils/getMemberByUid')
const addAttachments = require('./addAttachments')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()
const bucket = admin.storage().bucket()

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

  if (action.signature) {
    delete action.signature
    const user = await member.get('user').get()
    action.signature = {
      text: user.get('signatureText') || null,
      image: user.get('signatureImage') || null
    }
    if (!action.signature.text) {
      console.log(
        `Property 'signatureText' not set in user ${context.auth.uid}`
      )
    }
    if (!action.signature.image) {
      console.log(
        `Property 'signatureImage' not set in user ${context.auth.uid}`
      )
    }
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

  action.attachments = await addAttachments(
    bucket,
    organizationId,
    aircraftId,
    techlogEntryId,
    newActionRef.id,
    action.attachments
  )

  batch.set(newActionRef, action)

  batch.update(techlogEntryRef, {
    currentStatus: action.status,
    closed: techlogEntryClosed
  })

  await batch.commit()
})

exports.addTechlogEntryAction = addTechlogEntryAction
