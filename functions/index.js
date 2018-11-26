/* eslint-disable no-console */
const functions = require('firebase-functions')
const cors = require('cors')({
  origin: true
})

const admin = require('firebase-admin')
admin.initializeApp()

exports.deleteTestUser = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    try {
      return admin
        .auth()
        .getUserByEmail('test@opendigital.ch')
        .then(userRecord => {
          console.log(
            'User record found for email test@opendigital.ch: ' + userRecord.uid
          )
          return admin
            .auth()
            .deleteUser(userRecord.uid)
            .then(() =>
              res.json({ result: 'User test@opendigital.ch deleted' })
            )
        })
    } catch (e) {
      console.log('Failed to delete user test@opendigital.ch', e)
      return res.json({ result: 'Could not delete user test@opendigital.ch' })
    }
  })
})

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

exports.updateUserOrganizationsOnOrganizationWrite = functions.firestore
  .document('organizations/{organizationID}')
  .onWrite(change => updateUserOrganizations(change, 'owner', change.after.ref))

exports.updateUserOrganizationsOnMemberWrite = functions.firestore
  .document('organizations/{organizationID}/members/{memberID}')
  .onWrite(change =>
    updateUserOrganizations(change, 'user', change.after.ref.parent.parent)
  )
