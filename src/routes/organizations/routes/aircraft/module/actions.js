export const FETCH_FLIGHTS = 'aircraft/FETCH_FLIGHTS'

export const fetchFlights = (organizationId, aircraftId) => ({
  type: FETCH_FLIGHTS,
  payload: {
    organizationId,
    aircraftId
  }
})
