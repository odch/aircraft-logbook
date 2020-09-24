/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

const logChange = async (change, collectionName, orgRefResolver) => {
  const docRef = change.after ? change.after.ref : change.before.ref
  const orgRef = orgRefResolver(docRef)

  const newData = change.after.data()
  const previousData = change.before.data()

  const operation =
    previousData && newData ? 'update' : previousData ? 'delete' : 'create'
  const executedBy = newData ? newData['updatedBy'] : null
  const timestamp = newData ? newData['updateTimestamp'] : null

  await orgRef
    .collection('log')
    .doc()
    .set({
      collection: collectionName,
      timestamp: timestamp || new Date(),
      operation,
      docRef: docRef,
      executedBy: executedBy || null,
      before: previousData || null,
      after: newData || null
    })
}

module.exports.logMemberWrite = functions.firestore
  .document('organizations/{organizationID}/members/{memberID}')
  .onWrite(change =>
    logChange(change, 'members', memberRef => memberRef.parent.parent)
  )
