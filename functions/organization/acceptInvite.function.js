const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()

const checkExists = (doc, errorMsg) => {
  if (!doc.exists || doc.get('deleted')) {
    throw new Error(errorMsg)
  }
}

const acceptInvite = functions.https.onCall(
  async ({ organizationId, inviteId }, context) => {
    if (!context.auth || !context.auth.uid) {
      throw new Error('User is not authenticated')
    }

    await db.runTransaction(async t => {
      const userRef = db.collection('users').doc(context.auth.uid)
      const orgRef = db.collection('organizations').doc(organizationId)
      const memberRef = orgRef.collection('members').doc(inviteId)

      const userDoc = await t.get(userRef)
      const orgDoc = await t.get(orgRef)
      const memberDoc = await t.get(memberRef)

      checkExists(
        userDoc,
        `User doc for user ${context.auth.uid} does not exist or is marked as deleted`
      )
      checkExists(
        orgDoc,
        `Organization ${organizationId} does not exist or is marked as deleted`
      )
      checkExists(
        memberDoc,
        `Member doc ${inviteId} does not exist or is marked as deleted`
      )

      if (memberDoc.get('user')) {
        throw new Error(`User on member ${inviteId} already set`)
      }

      await t.update(memberRef, {
        user: userRef
      })

      const orgData = {
        ref: orgRef
      }
      const roles = memberDoc.get('roles') || []
      if (roles.length > 0) {
        orgData.roles = admin.firestore.FieldValue.arrayUnion(...roles)
      }

      await t.update(userRef, {
        [`orgs.${organizationId}`]: orgData
      })
    })
  }
)

exports.acceptInvite = acceptInvite
