/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

const updateFlight = async (flightDoc, flightsMap, nextVersion = 1) => {
  await flightDoc.ref.update({ version: nextVersion })
  const replacedWith = flightDoc.get('replacedWith')
  if (replacedWith) {
    const nextFlight = flightsMap[replacedWith]
    if (nextFlight) {
      await updateFlight(nextFlight, flightsMap, nextVersion + 1)
    }
  }
}

const recalculateFlightVersions = async change => {
  if (change.after.get('recalculateFlightVersions') === true) {
    const flights = await change.after.ref.collection('flights').get()

    const flightsMap = flights.docs.reduce((map, flightDoc) => {
      map[flightDoc.ref.id] = flightDoc
      return map
    }, {})

    for (const flightId in flightsMap) {
      if (Object.prototype.hasOwnProperty.call(flightsMap, flightId)) {
        const flightDoc = flightsMap[flightId]
        if (!flightDoc.get('replaces')) {
          await updateFlight(flightDoc, flightsMap)
        }
      }
    }

    await change.after.ref.update({
      recalculateFlightVersions: admin.firestore.FieldValue.delete()
    })
  }
}

module.exports.recalculateFlightVersions = functions.firestore
  .document('organizations/{organizationID}/aircrafts/{aircraftID}')
  .onUpdate(change => recalculateFlightVersions(change))
