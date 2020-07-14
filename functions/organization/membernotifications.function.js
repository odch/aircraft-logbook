/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const sendFlightRemarksNotification = require('./notifications/sendFlightRemarksNotification')
const sendTechlogCreationNotification = require('./notifications/sendTechlogCreationNotification')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

module.exports.sendFlightRemarksNotification = functions.firestore
  .document(
    'organizations/{organizationID}/aircrafts/{aircraftID}/flights/{flightID}'
  )
  .onWrite(change => sendFlightRemarksNotification(change))

module.exports.sendTechlogCreationNotification = functions.firestore
  .document(
    'organizations/{organizationID}/aircrafts/{aircraftID}/techlog/{techlogEntryID}'
  )
  .onCreate(techlogEntryDoc => sendTechlogCreationNotification(techlogEntryDoc))
