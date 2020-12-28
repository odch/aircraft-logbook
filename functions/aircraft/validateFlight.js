const _get = require('lodash.get')
const moment = require('moment-timezone')

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/

const isNullOrUndefined = value => value === null || value === undefined

const isBefore = (dateTime, timezone, comparisonDateTime, comparisonTimezone) =>
  moment
    .tz(dateTime, timezone)
    .isBefore(moment.tz(comparisonDateTime, comparisonTimezone))

const getLastFlights = async (organizationId, aircraftId, db) => {
  const lastFlights = await db
    .collection('organizations')
    .doc(organizationId)
    .collection('aircrafts')
    .doc(aircraftId)
    .collection('flights')
    .where('deleted', '==', false)
    .orderBy('blockOffTime', 'desc')
    .limit(2)
    .get()
  return lastFlights.docs
}

const validateSync = (data, aircraftSettings) => {
  const errors = {}

  if (!data.date || !DATE_PATTERN.test(data.date)) {
    errors['date'] = 'invalid'
  } else if (
    aircraftSettings.lockDate &&
    isBefore(
      data.date,
      undefined,
      aircraftSettings.lockDate.toDate(),
      undefined
    )
  ) {
    errors['date'] = 'not_before_lock_date'
  }
  if (!data.pilot) {
    errors['pilot'] = 'required'
  }
  if (!data.nature) {
    errors['nature'] = 'required'
  }
  if (!data.departureAerodrome) {
    errors['departureAerodrome'] = 'required'
  }
  if (typeof data.personsOnBoard !== 'number' || data.personsOnBoard < 1) {
    errors['personsOnBoard'] = 'required'
  }
  if (typeof data.fuelUplift !== 'number' || data.fuelUplift < 0) {
    errors['fuelUplift'] = 'required'
  } else if (data.fuelUplift > 0 && !data.fuelType) {
    errors['fuelType'] = 'required'
  }
  if (
    data.oilUplift &&
    (typeof data.oilUplift !== 'number' || data.oilUplift < 0)
  ) {
    errors['oilUplift'] = 'invalid'
  }
  if (data.preflightCheck !== true) {
    errors['preflightCheck'] = 'required'
  }

  const flightTimeStart = _get(data, 'counters.flightTimeCounter.start')
  if (aircraftSettings.flightTimeCounterEnabled === true) {
    if (typeof flightTimeStart !== 'number') {
      errors['counters.flightTimeCounter.start'] = 'required'
    }
  }

  const engineTimeStart = _get(data, 'counters.engineTimeCounter.start')
  if (aircraftSettings.engineHoursCounterEnabled === true) {
    if (typeof engineTimeStart !== 'number') {
      errors['counters.engineTimeCounter.start'] = 'required'
    }
  }

  // don't validate the following fields when draft flight is created (-> when data.id is not set)
  if (data.id) {
    if (!data.destinationAerodrome) {
      errors['destinationAerodrome'] = 'required'
    }

    if (!data.blockOffTime || !DATE_TIME_PATTERN.test(data.blockOffTime)) {
      errors['blockOffTime'] = 'invalid'
    }

    if (!data.takeOffTime || !DATE_TIME_PATTERN.test(data.takeOffTime)) {
      errors['takeOffTime'] = 'invalid'
    }

    if (!data.landingTime || !DATE_TIME_PATTERN.test(data.landingTime)) {
      errors['landingTime'] = 'invalid'
    }

    if (!data.blockOnTime || !DATE_TIME_PATTERN.test(data.blockOnTime)) {
      errors['blockOnTime'] = 'invalid'
    }

    if (
      !errors['blockOffTime'] &&
      !errors['takeOffTime'] &&
      data.departureAerodrome
    ) {
      if (
        isBefore(
          data.takeOffTime,
          data.departureAerodrome.timezone,
          data.blockOffTime,
          data.departureAerodrome.timezone
        )
      ) {
        errors['takeOffTime'] = 'not_before_block_off_time'
      }
    }

    if (
      !errors['takeOffTime'] &&
      !errors['landingTime'] &&
      data.departureAerodrome &&
      data.destinationAerodrome
    ) {
      if (
        isBefore(
          data.landingTime,
          data.destinationAerodrome.timezone,
          data.takeOffTime,
          data.departureAerodrome.timezone
        )
      ) {
        errors['landingTime'] = 'not_before_take_off_time'
      }
    }

    if (
      !errors['landingTime'] &&
      !errors['blockOnTime'] &&
      data.destinationAerodrome
    ) {
      if (
        isBefore(
          data.blockOnTime,
          data.destinationAerodrome.timezone,
          data.landingTime,
          data.destinationAerodrome.timezone
        )
      ) {
        errors['blockOnTime'] = 'not_before_landing_time'
      }
    }

    if (typeof data.landings !== 'number' || data.landings < 1) {
      errors['landings'] = 'required'
    }

    if (!data.troublesObservations) {
      errors['troublesObservations'] = 'required'
    }

    if (data.troublesObservations === 'troubles') {
      if (
        aircraftSettings.techlogEnabled === true &&
        !data.techlogEntryStatus
      ) {
        errors['techlogEntryStatus'] = 'required'
      }
      if (
        !data.techlogEntryDescription ||
        !data.techlogEntryDescription.trim()
      ) {
        errors['techlogEntryDescription'] = 'required'
      }
    }

    if (aircraftSettings.flightTimeCounterEnabled === true) {
      const flightTimeEnd = _get(data, 'counters.flightTimeCounter.end')
      if (typeof flightTimeEnd !== 'number') {
        errors['counters.flightTimeCounter.end'] = 'required'
      }
      if (
        !isNullOrUndefined(flightTimeStart) &&
        !isNullOrUndefined(flightTimeEnd)
      ) {
        if (flightTimeEnd < flightTimeStart) {
          errors['counters.flightTimeCounter.end'] = 'not_before_start_counter'
        }
      }
    }

    if (aircraftSettings.engineHoursCounterEnabled === true) {
      const engineTimeEnd = _get(data, 'counters.engineTimeCounter.end')
      if (typeof engineTimeEnd !== 'number') {
        errors['counters.engineTimeCounter.end'] = 'required'
      }
      if (
        !isNullOrUndefined(engineTimeStart) &&
        !isNullOrUndefined(engineTimeEnd)
      ) {
        if (engineTimeEnd < engineTimeStart) {
          errors['counters.engineTimeCounter.end'] = 'not_before_start_counter'
        }
      }
    }
  }

  return errors
}

const isPreflight = flight => flight.get('version') === 0

const getLastCompleteFlight = lastFlights => {
  if (!isPreflight(lastFlights[0])) {
    return lastFlights[0]
  }
  if (lastFlights.length > 1) {
    if (!isPreflight(lastFlights[1])) {
      return lastFlights[1]
    }
    throw new Error('Illegal state: 2 preflight entries')
  }
  return null
}

const isNewPreflight = data => !data.id

const isFlightCompletion = (data, lastFlight) =>
  !isNewPreflight(data) && isPreflight(lastFlight) && data.id === lastFlight.id

const validateAsync = async (data, organizationId, aircraftId, db) => {
  const errors = {}

  const lastFlights = await getLastFlights(organizationId, aircraftId, db)

  if (lastFlights.length === 0) {
    return errors
  }

  const lastCompleteFlight = getLastCompleteFlight(lastFlights)

  if (isNewPreflight(data) && isPreflight(lastFlights[0])) {
    throw new Error('Not allowed to create 2 subsequent preflight entries')
  }

  // date and time and so on currently not editable when updating flights
  // -> no need to validate in this case
  if (isNewPreflight(data) || isFlightCompletion(data, lastFlights[0])) {
    const isBeforeLastFlight =
      lastCompleteFlight &&
      isBefore(
        data.blockOffTime,
        data.departureAerodrome.timezone,
        lastCompleteFlight.get('blockOnTime').toDate(),
        lastCompleteFlight.get('destinationAerodrome').timezone
      )
    if (isBeforeLastFlight) {
      const field = isNewPreflight(data) ? 'date' : 'blockOffTime'
      errors[field] = 'not_before_block_on_time_last_flight'
    }
  }

  return errors
}

const validateCorrectionSync = (data, aircraftSettings) => {
  const errors = {}

  if (!data.date || !DATE_PATTERN.test(data.date)) {
    errors['date'] = 'invalid'
  } else if (
    aircraftSettings.lockDate &&
    isBefore(
      data.date,
      undefined,
      aircraftSettings.lockDate.toDate(),
      undefined
    )
  ) {
    errors['date'] = 'not_before_lock_date'
  }
  if (!data.time || !DATE_TIME_PATTERN.test(data.time)) {
    errors['time'] = 'invalid'
  }
  if (!data.pilot) {
    errors['pilot'] = 'required'
  }
  if (typeof data.remarks !== 'string' || data.remarks.trim().length === 0) {
    errors['remarks'] = 'required'
  }

  return errors
}

const validateCorrectionAsync = async (
  data,
  organizationId,
  aircraftId,
  db
) => {
  const errors = {}

  const lastFlights = await getLastFlights(organizationId, aircraftId, db)

  if (lastFlights.length === 0) {
    throw new Error('Not allowed to create correction flight as first record')
  }

  const lastFlight = lastFlights[0]

  if (isPreflight(lastFlight)) {
    throw new Error('Not allowed to create correction flight after preflight')
  }

  const isBeforeLastFlight = isBefore(
    data.time,
    (data.newAerodrome || data.aerodrome).timezone,
    lastFlight.get('blockOnTime').toDate(),
    lastFlight.get('destinationAerodrome').timezone
  )
  if (isBeforeLastFlight) {
    errors['time'] = 'not_before_block_on_time_last_flight'
  }

  return errors
}

module.exports.validateSync = validateSync
module.exports.validateAsync = validateAsync
module.exports.validateCorrectionSync = validateCorrectionSync
module.exports.validateCorrectionAsync = validateCorrectionAsync
