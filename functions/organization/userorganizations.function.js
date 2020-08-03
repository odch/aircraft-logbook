/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

const updateUserOrganizations = (change, fieldName, organizationRef) => {
  const data = change.after.data()
  const previousData = change.before.data()

  if (data && previousData && data[fieldName] == previousData[fieldName]) {
    return null
  }

  const promises = []

  if (previousData && previousData[fieldName]) {
    promises.push(
      previousData[fieldName].set(
        {
          organizations: admin.firestore.FieldValue.arrayRemove(organizationRef)
        },
        { merge: true }
      )
    )
  }

  if (data && data[fieldName]) {
    promises.push(
      data[fieldName].set(
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
    updateUserOrganizations(change, 'user', change.after.ref.parent.parent)
  )
