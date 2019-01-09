/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

const getCounterDiff = (flight, counterName) => {
  if (flight.counters) {
    const counter = flight.counters[counterName]
    if (
      counter &&
      typeof counter.start === 'number' &&
      typeof counter.end === 'number'
    ) {
      return counter.end - counter.start
    }
  }
  return 0
}

const getLandings = flight =>
  typeof flight.landings === 'number' ? flight.landings : 0

const getFlightCounterData = flightData =>
  flightData && flightData.deleted === false
    ? {
        landings: getLandings(flightData),
        flightHours: getCounterDiff(flightData, 'flightHours'),
        engineHours: getCounterDiff(flightData, 'engineHours')
      }
    : null

const getFlightDiff = (oldData, newData) => {
  if (oldData && newData) {
    return {
      flights: 0,
      landings: newData.landings - oldData.landings,
      flightHours: newData.flightHours - oldData.flightHours,
      engineHours: newData.engineHours - oldData.engineHours
    }
  } else if (newData) {
    return {
      flights: 1,
      landings: newData.landings,
      flightHours: newData.flightHours,
      engineHours: newData.engineHours
    }
  } else if (oldData) {
    return {
      flights: -1,
      landings: oldData.landings * -1,
      flightHours: oldData.flightHours * -1,
      engineHours: oldData.engineHours * -1
    }
  }
  return null
}

module.exports.updateAircraftFlightDataOnFlightsWrite = functions.firestore
  .document(
    'organizations/{organizationId}/aircrafts/{aircraftId}/flights/{flightId}'
  )
  .onWrite(event => {
    const newValue = event.after.data()
    const previousValue = event.before.data()

    const oldFlightData = getFlightCounterData(previousValue)
    const newFlightData = getFlightCounterData(newValue)

    const diff = getFlightDiff(oldFlightData, newFlightData)

    if (diff) {
      const aircraftRef = event.after.ref.parent.parent

      return aircraftRef.get().then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const data = documentSnapshot.data()

          const newCounters = diff

          if (data.counters) {
            newCounters.flights += data.counters.flights
            newCounters.landings += data.counters.landings
            newCounters.flightHours += data.counters.flightHours
            newCounters.engineHours += data.counters.engineHours
          }

          return aircraftRef.update({
            counters: newCounters
          })
        }

        return null
      })
    }

    return null
  })

module.exports.recalcuteAircraftFlightDataIfMissing = functions.firestore
  .document('organizations/{organizationId}/aircrafts/{aircraftId}')
  .onWrite(event => {
    const newValue = event.after.data()
    if (
      newValue &&
      (!newValue.counters ||
        newValue.counters.flights === undefined ||
        newValue.counters.landings === undefined ||
        newValue.counters.flightHours === undefined ||
        newValue.counters.engineHours === undefined)
    ) {
      return event.after.ref
        .collection('flights')
        .where('deleted', '==', false)
        .get()
        .then(querySnapshot => {
          const counters = querySnapshot.docs.reduce(
            (acc, currentFlight) => {
              const flightData = currentFlight.data()

              acc.flights++

              acc.landings += getLandings(flightData)
              acc.flightHours += getCounterDiff(flightData, 'flightHours')
              acc.engineHours += getCounterDiff(flightData, 'engineHours')

              return acc
            },
            {
              flights: 0,
              flightHours: 0,
              engineHours: 0,
              landings: 0
            }
          )
          return event.after.ref.update({
            counters
          })
        })
    }
    return null
  })
