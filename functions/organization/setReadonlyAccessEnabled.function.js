const functions = require('firebase-functions')
const admin = require('firebase-admin')
const uuid = require('uuid')
const getMemberByUid = require('../utils/getMemberByUid')
const requireRole = require('../utils/requireRole')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()

const setReadonlyAccessEnabled = functions.https.onCall(
  async (data, context) => {
    const { organizationId, enabled } = data

    const member = await getMemberByUid(db, organizationId, context.auth.uid)

    requireRole(member, ['manager'])

    await db.runTransaction(async t => {
      const orgRef = db.collection('organizations').doc(organizationId)

      const orgDoc = await t.get(orgRef)

      const readonlyAccessToken = orgDoc.get('readonlyAccessToken') || uuid.v4()

      await t.update(orgRef, {
        readonlyAccessEnabled: enabled,
        readonlyAccessToken
      })
    })
  }
)

exports.setReadonlyAccessEnabled = setReadonlyAccessEnabled
