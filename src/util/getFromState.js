import { isBefore } from './dates'

export const getUserEmail = state => {
  const auth = state.firebase.auth
  if (auth.isLoaded !== true) {
    return undefined
  }
  if (auth.isEmpty === true) {
    return null
  }
  return auth.email
}

const isExpired = organization => {
  const expiration = organization.limits ? organization.limits.expiration : null
  return expiration
    ? isBefore(expiration, undefined, new Date(), undefined)
    : false
}

export const getOrganization = (state, organizationId) => {
  const organizations = state.main.app.organizations
  if (organizations) {
    const organization = organizations.find(org => org.id === organizationId)
    if (organization) {
      return {
        ...organization,
        id: organizationId,
        roles: organization.roles || [],
        lockDate: organization.lockDate || null,
        expired: isExpired(organization)
      }
    }
    return null // not found
  }
  return undefined // still loading
}

const aircraftSettings = (aircraftSettings = {}, organization = {}) => {
  const limits = organization.limits || {}

  return {
    fuelTypes: aircraftSettings.fuelTypes || [],
    flightTimeCounterEnabled:
      aircraftSettings.flightTimeCounterEnabled === true,
    flightTimeCounterFractionDigits:
      aircraftSettings.flightTimeCounterFractionDigits,
    engineHoursCounterEnabled:
      aircraftSettings.engineHoursCounterEnabled === true,
    engineHoursCounterFractionDigits:
      aircraftSettings.engineHoursCounterFractionDigits,
    engineTachHoursCounterEnabled:
      aircraftSettings.engineTachHoursCounterEnabled === true,
    engineTachHoursCounterFractionDigits:
      aircraftSettings.engineTachHoursCounterFractionDigits,
    techlogEnabled:
      aircraftSettings.techlogEnabled === true &&
      limits.techlogDisabled !== true,
    techlogSignatureEnabled: aircraftSettings.techlogSignatureEnabled === true,
    lockDate: aircraftSettings.lockDate
      ? aircraftSettings.lockDate.toDate()
      : null
  }
}

export const getAircraft = (state, aircraftId) => {
  const organizationAircrafts = state.firestore.data.organizationAircrafts
  if (organizationAircrafts) {
    const foundAircraft = organizationAircrafts[aircraftId]
    if (foundAircraft) {
      const aircraft = { ...foundAircraft, id: aircraftId }

      const techlogEntriesCount =
        aircraft.counters && aircraft.counters.techlogEntries
          ? aircraft.counters.techlogEntries
          : 0
      const flightsTotalCount =
        aircraft.counters && aircraft.counters.flightsTotal
          ? aircraft.counters.flightsTotal
          : 0
      aircraft.counters = getAircraftCounters(state, aircraftId)
      aircraft.counters.techlogEntries = techlogEntriesCount
      aircraft.counters.flightsTotal = flightsTotalCount

      const organization = getOrganization(
        state,
        state.firebase.profile.selectedOrganization
      )
      aircraft.settings = aircraftSettings(aircraft.settings, organization)

      return aircraft
    }
    return null // not found
  }
  return undefined // still loading
}

export const getAircraftFlights = (state, aircraftId, page, showDeleted) => {
  const flights =
    state.firestore.ordered[
      `${showDeleted ? 'flights-all' : 'flights'}-${aircraftId}-${page}`
    ]
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

export const getAircraftFlightsCount = (state, aircraftId, withDeleted) =>
  withDeleted
    ? getAircraft(state, aircraftId).counters.flightsTotal
    : getAircraftCounters(state, aircraftId).flights

const getCounterValue = (latestFlight, name) =>
  latestFlight.counters[name].end || latestFlight.counters[name].start

const getAircraftCounters = (state, aircraftId) => {
  const latestFlight = getLatestFlight(state, aircraftId)

  if (latestFlight) {
    const counters = {
      flights: getCounterValue(latestFlight, 'flights'),
      landings: getCounterValue(latestFlight, 'landings'),
      flightHours: getCounterValue(latestFlight, 'flightHours')
    }
    if (latestFlight.counters.engineHours) {
      counters.engineHours = getCounterValue(latestFlight, 'engineHours')
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

export const getAircraftTechlog = (state, aircraftId, page) =>
  techlogWithActions(state, `techlog-${aircraftId}-${page}`)

export const getAircraftTechlogOpen = (state, aircraftId) =>
  techlogWithActions(state, `techlog-${aircraftId}-open`)

const techlogWithActions = (state, stateId) => {
  const techlogEntries = state.firestore.ordered[stateId]
  if (techlogEntries) {
    return techlogEntries.map(entry => ({
      ...entry,
      actions: state.firestore.ordered[`techlog-entry-actions-${entry.id}`]
    }))
  }
  return undefined
}

export const getLatestCrs = (state, aircraftId) => {
  const arr = state.firestore.ordered[`latest-crs-${aircraftId}`]
  if (arr) {
    if (arr.length === 1) {
      const entry = arr[0]
      return {
        ...entry,
        actions: state.firestore.ordered[`techlog-entry-actions-${entry.id}`]
      }
    }
    return null
  }
  return undefined
}

export const getAircraftChecks = (state, aircraftId) =>
  state.firestore.ordered[`checks-${aircraftId}`]
