const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getMemberByUid = require('../utils/getMemberByUid')
const requireRole = require('../utils/requireRole')
const getOrganizationLimits = require('../utils/getOrganizationLimits')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()

const memberObject = memberDocument =>
  memberDocument && memberDocument.exists
    ? {
        firstname: memberDocument.get('firstname') || null,
        lastname: memberDocument.get('lastname') || null,
        nr: memberDocument.get('nr') || null,
        member: memberDocument.ref,
        id: memberDocument.id
      }
    : null

const validateMember = member => {
  if (!member) {
    throw new Error('Member data is missing')
  }
  if (!member.firstname) {
    throw new Error('Member firstname is missing')
  }
  if (!member.lastname) {
    throw new Error('Member lastname is missing')
  }
}

const isMembersLimitReached = async (db, organizationId) => {
  const limits = await getOrganizationLimits(db, organizationId)
  if (typeof limits.members !== 'number') {
    return false
  }
  const members = await db
    .collection('organizations')
    .doc(organizationId)
    .collection('members')
    .where('deleted', '==', false)
    .get()
  const joinedOrInvitedMembers = members.docs.filter(
    member => member.get('user') || member.get('inviteTimestamp')
  )
  return joinedOrInvitedMembers.length >= limits.members
}

const addMember = functions.https.onCall(async (data, context) => {
  const { organizationId, member } = data

  const currentMember = await getMemberByUid(
    db,
    organizationId,
    context.auth.uid
  )
  requireRole(currentMember, ['manager'])

  const currentMemberObject = memberObject(currentMember)

  validateMember(member)

  if (member.inviteEmail) {
    const limitReached = await isMembersLimitReached(db, organizationId)
    if (limitReached) {
      return {
        error: 'LIMIT_REACHED'
      }
    }
  }

  const dataToStore = {
    ...member,
    deleted: false,
    createdBy: currentMemberObject,
    updatedBy: currentMemberObject,
    createTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    updateTimestamp: admin.firestore.FieldValue.serverTimestamp()
  }

  await db
    .collection('organizations')
    .doc(organizationId)
    .collection('members')
    .doc()
    .set(dataToStore)
})

exports.addMember = addMember
