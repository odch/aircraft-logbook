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
      previousData[fieldName].update({
        organizations: admin.firestore.FieldValue.arrayRemove(organizationRef)
      })
    )
  }

  if (data && data[fieldName]) {
    promises.push(
      data[fieldName].update({
        organizations: admin.firestore.FieldValue.arrayUnion(organizationRef)
      })
    )
  }

  return Promise.all(promises)
}

module.exports.updateUserOrganizationsOnOrganizationWrite = functions.firestore
  .document('organizations/{organizationID}')
  .onWrite(change => updateUserOrganizations(change, 'owner', change.after.ref))

module.exports.updateUserOrganizationsOnMemberWrite = functions.firestore
  .document('organizations/{organizationID}/members/{memberID}')
  .onWrite(change =>
    updateUserOrganizations(change, 'user', change.after.ref.parent.parent)
  )
