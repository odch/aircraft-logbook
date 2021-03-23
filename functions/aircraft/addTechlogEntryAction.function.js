const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getMemberByUid = require('../utils/getMemberByUid')
const checkNotExpired = require('../utils/checkNotExpired')
const addAttachments = require('./addAttachments')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()
const bucket = admin.storage().bucket()

const hasRole = (member, role) => member.get('roles').includes(role)

const isTechlogManager = member => hasRole(member, 'techlogmanager')

const isOrganizationManager = member => hasRole(member, 'manager')

const hasActionCreatePermission = (member, currentStatus, newStatus) =>
  isTechlogManager(member) ||
  (isOrganizationManager(member) &&
    currentStatus === 'for_information_only' &&
    ['for_information_only', 'closed'].includes(newStatus))

const addTechlogEntryAction = functions.https.onCall(async (data, context) => {
  const {
    organizationId,
    aircraftId,
    techlogEntryId,
    techlogEntryClosed,
    action
  } = data

  await checkNotExpired(db, organizationId)

  const member = await getMemberByUid(db, organizationId, context.auth.uid)

  const author = {
    firstname: member.get('firstname'),
    lastname: member.get('lastname'),
    nr: member.get('nr') || null,
    member: member.ref,
    id: member.id
  }

  action.timestamp = new Date()
  action.deleted = false
  action.author = author

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

  await db.runTransaction(async t => {
    const techlogEntryRef = db
      .collection('organizations')
      .doc(organizationId)
      .collection('aircrafts')
      .doc(aircraftId)
      .collection('techlog')
      .doc(techlogEntryId)

    const techlogEntryDoc = await t.get(techlogEntryRef)

    if (
      !hasActionCreatePermission(
        member,
        techlogEntryDoc.get('currentStatus'),
        action.status
      )
    ) {
      throw new Error(
        `User ${context.auth.uid} not permitted to add action to entry ${techlogEntryId} in org ${organizationId}`
      )
    }

    const newActionRef = techlogEntryRef.collection('actions').doc()

    action.attachments = await addAttachments(
      bucket,
      organizationId,
      aircraftId,
      techlogEntryId,
      newActionRef.id,
      action.attachments
    )

    await t.set(newActionRef, action)

    const techlogEntryData = {
      currentStatus: action.status,
      closed: techlogEntryClosed
    }

    if (techlogEntryClosed) {
      techlogEntryData.closedTimestamp = admin.firestore.FieldValue.serverTimestamp()
      techlogEntryData.closedBy = author
    } else {
      techlogEntryData.closedTimestamp = admin.firestore.FieldValue.delete()
      techlogEntryData.closedBy = admin.firestore.FieldValue.delete()
    }

    await t.update(techlogEntryRef, techlogEntryData)
  })
})

exports.addTechlogEntryAction = addTechlogEntryAction
