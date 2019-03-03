import { getTimeDiffInHundredthsOfHour } from '../../../../../../util/dates'

export const getCounters = data => {
  validate(data)

  const c = data.counters

  const flightTimeCounter = c.flightTimeCounter
  const engineTimeCounter = c.engineTimeCounter

  const flights = interval(c.flights.start, c.flights.start + 1)
  const landings = interval(c.landings.start, c.landings.start + data.landings)
  const blockHours = interval(
    c.blockHours.start,
    addTimeDiff(c.blockHours.start, data.blockOffTime, data.blockOnTime)
  )
  const flightHours = interval(
    c.flightHours.start,
    flightTimeCounter
      ? c.flightHours.start + (flightTimeCounter.end - flightTimeCounter.start)
      : addTimeDiff(c.flightHours.start, data.takeOffTime, data.landingTime)
  )
  const engineHours = engineTimeCounter
    ? interval(
        c.engineHours.start,
        c.engineHours.start + (engineTimeCounter.end - engineTimeCounter.start)
      )
    : null

  const counters = {
    flights,
    landings,
    flightHours,
    blockHours
  }

  if (engineHours) counters.engineHours = engineHours
  if (flightTimeCounter) counters.flightTimeCounter = flightTimeCounter
  if (engineTimeCounter) counters.engineTimeCounter = engineTimeCounter

  return counters
}

export const addTimeDiff = (value, diffStart, diffEnd) => {
  const diff = getTimeDiffInHundredthsOfHour(diffStart, diffEnd)
  return value + diff
}

export const validate = data => {
  const counters = data.counters
  if (!counters) {
    throw 'Counters property missing'
  }

  if (!counters.flights || typeof counters.flights.start !== 'number') {
    throw 'Property `counters.flights.start` missing or not a number'
  }
  if (!counters.landings || typeof counters.landings.start !== 'number') {
    throw 'Property `counters.landings.start` missing or not a number'
  }
  if (!counters.blockHours || typeof counters.blockHours.start !== 'number') {
    throw 'Property `counters.blockHours.start` missing or not a number'
  }
  if (!counters.flightHours || typeof counters.flightHours.start !== 'number') {
    throw 'Property `counters.flightHours.start` missing or not a number'
  }

  if (typeof data.landings !== 'number') {
    throw 'Property `landings` missing or not a number'
  }
  if (typeof data.blockOffTime !== 'string') {
    throw 'Property `blockOffTime` missing or not a string'
  }
  if (typeof data.blockOnTime !== 'string') {
    throw 'Property `blockOnTime` missing or not a string'
  }
  if (typeof data.takeOffTime !== 'string') {
    throw 'Property `takeOffTime` missing or not a string'
  }
  if (typeof data.landingTime !== 'string') {
    throw 'Property `landingTime` missing or not a string'
  }
}

function interval(start, end) {
  return {
    start,
    end
  }
}
