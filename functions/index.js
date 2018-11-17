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
