/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const sendFlightRemarksNotification = require('./notifications/sendFlightRemarksNotification')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

module.exports.sendFlightRemarksNotification = functions.firestore
  .document(
    'organizations/{organizationID}/aircrafts/{aircraftID}/flights/{flightID}'
  )
  .onWrite(change => sendFlightRemarksNotification(change))
