const COLUMNS = {
  Registration: aircraft => aircraft.get('registration'),
  FlightID: (aircraft, flight) => flight.id,
  BlockOffTime: (aircraft, flight) => getDateIsoString(flight, 'blockOffTime'),
  BlockOnTime: (aircraft, flight) => getDateIsoString(flight, 'blockOnTime'),
  TakeOffTime: (aircraft, flight) => getDateIsoString(flight, 'takeOffTime'),
  LandingTime: (aircraft, flight) => getDateIsoString(flight, 'landingTime'),
  Nature: (aircraft, flight) => flight.get('nature'),
  DepartureAerodromeID: (aircraft, flight) =>
    resolveRefAndGet(flight, 'departureAerodrome', 'identification'),
  DepartureAerodromeName: (aircraft, flight) =>
    resolveRefAndGet(flight, 'departureAerodrome', 'name'),
  DestinationAerodromeID: (aircraft, flight) =>
    resolveRefAndGet(flight, 'destinationAerodrome', 'identification'),
  DestinationAerodromeName: (aircraft, flight) =>
    resolveRefAndGet(flight, 'destinationAerodrome', 'name'),
  PilotLastName: (aircraft, flight) =>
    resolveRefAndGet(flight, 'pilot', 'lastname'),
  PilotFirstName: (aircraft, flight) =>
    resolveRefAndGet(flight, 'pilot', 'firstname'),
  PilotMemberNr: (aircraft, flight) => resolveRefAndGet(flight, 'pilot', 'nr'),
  InstructorLastName: (aircraft, flight) =>
    resolveRefAndGet(flight, 'instructor', 'lastname'),
  InstructorFirstName: (aircraft, flight) =>
    resolveRefAndGet(flight, 'instructor', 'firstname'),
  InstructorMemberNr: (aircraft, flight) =>
    resolveRefAndGet(flight, 'instructor', 'nr'),
  Landings: (aircraft, flight) => flight.get('landings'),
  FuelUplift: (aircraft, flight) => flight.get('fuelUplift'),
  FuelUnit: (aircraft, flight) => flight.get('fuelUnit'),
  FuelType: (aircraft, flight) => flight.get('fuelType'),
  OilUplift: (aircraft, flight) => flight.get('oilUplift'),
  OilUnit: (aircraft, flight) => flight.get('oilUnit'),
  FlightsCounterStart: (aircraft, flight) =>
    flight.get('counters.flights.start'),
  FlightsCounterEnd: (aircraft, flight) => flight.get('counters.flights.end'),
  LandingsCounterStart: (aircraft, flight) =>
    flight.get('counters.landings.start'),
  LandingsCounterEnd: (aircraft, flight) => flight.get('counters.landings.end'),
  FlightHoursCounterStart: (aircraft, flight) =>
    flight.get('counters.flightHours.start'),
  FlightHoursCounterEnd: (aircraft, flight) =>
    flight.get('counters.flightHours.end'),
  FlightTimeCounterStart: (aircraft, flight) =>
    flight.get('counters.flightTimeCounter.start'),
  FlightTimeCounterEnd: (aircraft, flight) =>
    flight.get('counters.flightTimeCounter.end'),
  OwnerLastName: async (aircraft, flight) =>
    resolveRefAndGet(flight, 'owner', 'lastname'),
  OwnerFirstName: async (aircraft, flight) =>
    resolveRefAndGet(flight, 'owner', 'firstname'),
  OwnerMemberNr: async (aircraft, flight) =>
    resolveRefAndGet(flight, 'owner', 'nr'),
  Remarks: (aircraft, flight) => flight.get('remarks')
}

const getOrganization = async (firstore, organization) =>
  firstore
    .collection('organizations')
    .doc(organization)
    .get()

const checkPermissions = async (firestore, organization, user) => {
  const userRef = firestore.collection('users').doc(user.uid)

  const memberQuerySnapshot = await organization.ref
    .collection('members')
    .where('roles', 'array-contains', 'manager')
    .where('user', '==', userRef)
    .get()

  if (memberQuerySnapshot.empty !== false) {
    throw new Error('User ' + user.uid + ' not authorized')
  }
}

const getAircrafts = async organization =>
  organization.ref
    .collection('aircrafts')
    .orderBy('registration')
    .get()

const getFlights = async (aircraft, start, end) =>
  aircraft.ref
    .collection('flights')
    .where('deleted', '==', false)
    .where('blockOffTime', '>=', start)
    .where('blockOffTime', '<=', end)
    .orderBy('blockOffTime')
    .get()

const resolveRef = async (doc, prop) => {
  const ref = doc.get(prop)
  if (ref) {
    return ref.get()
  } else {
    return Promise.resolve(null)
  }
}

const resolveRefAndGet = async (doc, ref, prop) => {
  const resolvedDoc = await resolveRef(doc, ref)
  if (resolvedDoc) {
    return resolvedDoc.get(prop)
  }
  return null
}

const getDateIsoString = (flight, prop) =>
  flight
    .get(prop)
    .toDate()
    .toISOString()

const validateDateString = dateString => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error('Invalid date string ' + dateString)
  }
}
const getSelectedColumns = columnsArg => {
  const selectedColumns = new Set()
  if (typeof columnsArg === 'string') {
    columnsArg.split(',').forEach(col => {
      col = col.trim()
      if (Object.prototype.hasOwnProperty.call(COLUMNS, col)) {
        selectedColumns.add(col)
      } else {
        throw new Error('Unknown column ' + col)
      }
    })
  }
  if (selectedColumns.size > 0) {
    return Object.keys(COLUMNS).filter(column => selectedColumns.has(column))
  }
  return Object.keys(COLUMNS)
}

/**
 * @param firestore
 * @param args
 *  * organization
 *  * startDate
 *  * endDate
 *  * columns
 * @returns {Promise<Array>}
 */
const collectFlights = async (firestore, args, user) => {
  const flights = []

  validateDateString(args.startDate)
  validateDateString(args.endDate)

  const start = new Date(args.startDate + 'T00:00:00.000Z')
  const end = new Date(args.endDate + 'T23:59:59.999Z')

  const organization = await getOrganization(firestore, args.organization)

  await checkPermissions(firestore, organization, user)

  const aircrafts = await getAircrafts(organization)

  const selectedColumns = getSelectedColumns(args.columns)

  for (let i = 0; i < aircrafts.docs.length; i++) {
    const aircraftDoc = aircrafts.docs[i]

    const flightsSnapshot = await getFlights(aircraftDoc, start, end)

    for (let j = 0; j < flightsSnapshot.docs.length; j++) {
      const flight = flightsSnapshot.docs[j]

      const record = {}

      const valuePromises = selectedColumns.map(column => {
        const handler = COLUMNS[column]
        const value = handler(aircraftDoc, flight)
        if (value instanceof Promise) {
          return value
        }
        return Promise.resolve(value)
      })

      const values = await Promise.all(valuePromises)

      selectedColumns.forEach((column, index) => {
        record[column] = values[index]
      })

      flights.push(record)
    }
  }

  return flights
}

module.exports = collectFlights
