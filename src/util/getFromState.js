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
      return { ...foundAircraft, id: aircraftId }
    }
    return null // not found
  }
  return undefined // still loading
}

export const getAircraftFlights = (state, aircraftId) => {
  const flights = state.firestore.ordered['flights-' + aircraftId]
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
