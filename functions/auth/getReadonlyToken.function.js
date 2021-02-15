const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()

const getReadonlyToken = functions.https.onCall(async data => {
  const {
    token: { orgId, token }
  } = data
  const doc = await db.collection('organizations').doc(orgId).get()

  if (
    doc.exists === true &&
    doc.get('readonlyAccessToken') === token &&
    doc.get('readonlyAccessEnabled') === true
  ) {
    return admin.auth().createCustomToken('readonly', {
      organization: orgId
    })
  }

  return null
})

exports.getReadonlyToken = getReadonlyToken
