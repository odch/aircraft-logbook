export const getOrganization = (state, organizationId) => {
  const organizations = state.main.app.organizations
  if (organizations) {
    const organization = organizations.find(org => org.id === organizationId)
    if (organization) {
      return { ...organization, id: organizationId }
    }
    return null // not found
  }
  return undefined // still loading
}

export const getAircraft = (state, aircraftId) => {
  const organizationAircrafts = state.firestore.data.organizationAircrafts
  if (organizationAircrafts) {
    const foundAircraft = organizationAircrafts[aircraftId]
    if (foundAircraft) {
      const aircraft = { ...foundAircraft, id: aircraftId }
      aircraft.counters = getAircraftCounters(state, aircraftId)
      return aircraft
    }
    return null // not found
  }
  return undefined // still loading
}

export const getAircraftFlights = (state, aircraftId, page) => {
  const flights = state.firestore.ordered[`flights-${aircraftId}-${page}`]
  if (flights) {
    if (flights.length > 0) {
      // just to check if populated
      if (flights[0].departureAerodrome.name) {
        return flights
      }
      return undefined // not yet populated
    }
    return flights
  }
  return undefined
}

export const getAircraftFlightsCount = (state, aircraftId) =>
  getAircraftCounters(state, aircraftId).flights

const getAircraftCounters = (state, aircraftId) => {
  const latestFlight = getLatestFlight(state, aircraftId)

  if (latestFlight) {
    const counters = {
      flights: latestFlight.counters.flights.end,
      landings: latestFlight.counters.landings.end,
      flightHours: latestFlight.counters.flightHours.end
    }
    if (latestFlight.counters.engineHours) {
      counters.engineHours = latestFlight.counters.engineHours.end
    }
    return counters
  }

  return {
    flights: 0,
    landings: 0,
    flightHours: 0
  }
}

const getLatestFlight = (state, aircraftId) => {
  if (state.firestore && state.firestore.ordered) {
    const flights = state.firestore.ordered[`flights-${aircraftId}-0`]
    if (flights && flights.length > 0) {
      return flights[0]
    }
  }
  return null
}
