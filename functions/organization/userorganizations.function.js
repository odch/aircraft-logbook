/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

const updateUserOrganizations = (change, organizationRef) => {
  const data = change.after.data()
  const previousData = change.before.data()

  const userRef = data ? data.user : null
  const previousUserRef = previousData ? previousData.user : null

  if (userRef && previousUserRef && userRef.id === previousUserRef.id) {
    return null
  }

  const promises = []

  if (previousUserRef) {
    promises.push(
      previousUserRef.set(
        {
          organizations: admin.firestore.FieldValue.arrayRemove(organizationRef)
        },
        { merge: true }
      )
    )
  }

  if (userRef) {
    promises.push(
      userRef.set(
        {
          organizations: admin.firestore.FieldValue.arrayUnion(organizationRef)
        },
        { merge: true }
      )
    )
  }

  return Promise.all(promises)
}

module.exports.updateUserOrganizationsOnMemberWrite = functions.firestore
  .document('organizations/{organizationID}/members/{memberID}')
  .onWrite(change =>
    updateUserOrganizations(change, change.after.ref.parent.parent)
  )
