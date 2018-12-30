/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

module.exports.updateFlightsCounterOnFlightsWrite = functions.firestore
  .document(
    'organizations/{organizationId}/aircrafts/{aircraftId}/flights/{flightId}'
  )
  .onWrite(event => {
    const newValue = event.after.data()
    const previousValue = event.before.data()

    let increment = 0
    if (
      previousValue &&
      previousValue.deleted === false &&
      (!newValue || newValue.deleted === true)
    ) {
      increment = -1
    } else if (
      (!previousValue || previousValue.deleted === true) &&
      newValue &&
      newValue.deleted === false
    ) {
      increment = 1
    }

    if (increment === 0) {
      return null
    } else {
      const aircraftRef = event.after.ref.parent.parent

      return aircraftRef.get().then(documentSnapshot => {
        let currentCount = 0
        if (documentSnapshot.exists) {
          const data = documentSnapshot.data()
          if (data.counters && data.counters.flights) {
            currentCount = data.counters.flights
          }
        }

        return aircraftRef.update({
          'counters.flights': Number(currentCount) + increment
        })
      })
    }
  })

module.exports.recalcuteFlightsCounterIfMissing = functions.firestore
  .document('organizations/{organizationId}/aircrafts/{aircraftId}')
  .onWrite(event => {
    const newValue = event.after.data()
    if (
      newValue &&
      (!newValue.counters || newValue.counters.flights === undefined)
    ) {
      return event.after.ref
        .collection('flights')
        .where('deleted', '==', false)
        .get()
        .then(querySnapshot =>
          event.after.ref.update({
            'counters.flights': querySnapshot.docs.length
          })
        )
    }
    return null
  })
