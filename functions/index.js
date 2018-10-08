/* eslint-disable no-console */
const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

exports.deleteTestUser = functions.https.onRequest((/* req, res */) => {
  admin
    .auth()
    .getUserByEmail('test@opendigital.ch')
    .then(function(userRecord) {
      console.log(
        'User record found for email test@opendigital.ch: ' + userRecord.uid
      )
      admin.auth().deleteUser(userRecord.uid)
    })
})
