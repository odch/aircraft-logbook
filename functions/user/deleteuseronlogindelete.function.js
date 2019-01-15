/* eslint-disable no-console */
/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

module.exports.deleteUserOnLoginDelete = functions.auth
  .user()
  .onDelete(user => {
    console.log(
      'Login ',
      user.email,
      ' deleted. Will delete matching user document(s).'
    )
    return admin
      .firestore()
      .collection('users')
      .where('email', '==', user.email)
      .get()
      .then(function(querySnapshot) {
        const deletePromises = []
        querySnapshot.forEach(function(doc) {
          console.log('Deleting user document ', doc.id)
          deletePromises.push(doc.ref.delete())
        })
        return Promise.all(deletePromises)
      })
      .catch(function(error) {
        console.log('Error deleting user documents: ', error)
      })
  })
