/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

const recalculateAircraftFlightsCounter = async change => {
  const flightsTotal = change.after.get('counters.flightsTotal')
  if (!(typeof flightsTotal === 'number')) {
    const flights = await change.after.ref.collection('flights').get()
    await change.after.ref.update({
      'counters.flightsTotal': flights.size
    })
  }
}

const incrementAircraftFlightsCounter = async flightDoc => {
  const aircraftRef = flightDoc.ref.parent.parent
  await aircraftRef.update({
    'counters.flightsTotal': admin.firestore.FieldValue.increment(1)
  })
}

module.exports.recalculateAircraftFlightsCounter = functions.firestore
  .document('organizations/{organizationID}/aircrafts/{aircraftID}')
  .onUpdate(change => recalculateAircraftFlightsCounter(change))

module.exports.incrementAircraftFlightsCounter = functions.firestore
  .document(
    'organizations/{organizationID}/aircrafts/{aircraftID}/flights/{flightID}'
  )
  .onCreate(flightDoc => incrementAircraftFlightsCounter(flightDoc))
