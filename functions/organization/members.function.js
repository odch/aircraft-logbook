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

const getCurrentMemberObject = async (organizationId, uid) => {
  const currentMember = await getMemberByUid(db, organizationId, uid)
  requireRole(currentMember, ['manager'])
  return memberObject(currentMember)
}

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

  const currentMemberObject = await getCurrentMemberObject(
    organizationId,
    context.auth.uid
  )

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

const updateMember = functions.https.onCall(async (data, context) => {
  const { organizationId, memberId, member } = data

  const currentMemberObject = await getCurrentMemberObject(
    organizationId,
    context.auth.uid
  )

  validateMember(member)

  const memberDoc = await db
    .collection('organizations')
    .doc(organizationId)
    .collection('members')
    .doc(memberId)
    .get()

  if (memberDoc.exists !== true || memberDoc.get('deleted')) {
    throw new Error(
      `Cannot update member that does not exist or is marked as deleted (org id: ${organizationId}, member id: ${memberId})`
    )
  }

  if (!memberDoc.get('inviteEmail') && member.inviteEmail) {
    const limitReached = await isMembersLimitReached(db, organizationId)
    if (limitReached) {
      return {
        error: 'LIMIT_REACHED'
      }
    }
  }

  const dataToStore = {
    ...member,
    updatedBy: currentMemberObject,
    updateTimestamp: admin.firestore.FieldValue.serverTimestamp()
  }

  if (dataToStore.reinvite === true) {
    dataToStore.inviteTimestamp = admin.firestore.FieldValue.delete()
    delete dataToStore.reinvite
  }

  await memberDoc.ref.update(dataToStore)
})

const deleteMember = functions.https.onCall(async (data, context) => {
  const { organizationId, memberId } = data

  const currentMemberObject = await getCurrentMemberObject(
    organizationId,
    context.auth.uid
  )

  const dataToStore = {
    deleted: true,
    updatedBy: currentMemberObject,
    deletedBy: currentMemberObject,
    updateTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    deleteTimestamp: admin.firestore.FieldValue.serverTimestamp()
  }

  await db
    .collection('organizations')
    .doc(organizationId)
    .collection('members')
    .doc(memberId)
    .update(dataToStore)
})

exports.addMember = addMember
exports.updateMember = updateMember
exports.deleteMember = deleteMember
