const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()

const fetchInvite = functions.https.onCall(
  async ({ organizationId, inviteId }, context) => {
    const member = await db
      .collection('organizations')
      .doc(organizationId)
      .collection('members')
      .doc(inviteId)
      .get()

    if (member.exists !== true || member.get('deleted')) {
      return null
    }

    const data = member.data()

    if (data.user) {
      return context.auth && context.auth.uid === data.user.id
        ? {
            accepted: true,
            firstname: data.firstname
          }
        : null
    }

    return {
      accepted: false,
      firstname: data.firstname
    }
  }
)

exports.fetchInvite = fetchInvite
