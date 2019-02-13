import { fork, takeEvery, all, call, put, select } from 'redux-saga/effects'
import moment from 'moment-timezone'
import _get from 'lodash.get'
import { getFirestore } from '../../../../../util/firebase'
import * as actions from './actions'
import { getMemberOption, getAerodromeOption } from '../util/getOptions'
import { error } from '../../../../../util/log'
import { getDoc, addDoc, updateDoc } from '../../../../../util/firestoreUtils'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/

export const uidSelector = state => state.firebase.auth.uid
export const organizationMembersSelector = state =>
  state.firestore.ordered.organizationMembers
export const flightsSelector = (aircraftId, page) => state =>
  state.firestore.ordered[`flights-${aircraftId}-${page}`]
export const aircraftFlightsViewSelector = state => state.aircraft.flights
export const aircraftSettingsSelector = (state, aircraftId) =>
  state.firestore.data.organizationAircrafts[aircraftId].settings

export function* getStartFlightDocument(organizationId, aircraftId, page) {
  if (page === 0) {
    return null
  }
  const previousPage = yield select(flightsSelector(aircraftId, page - 1))
  if (previousPage && previousPage.length > 0) {
    const lastFlight = previousPage[previousPage.length - 1]
    return yield call(getFlight, organizationId, aircraftId, lastFlight.id)
  }
  return null
}

export function* fetchFlights({
  payload: { organizationId, aircraftId, page, rowsPerPage }
}) {
  const startFlightDocument = yield call(
    getStartFlightDocument,
    organizationId,
    aircraftId,
    page
  )
  const firestore = yield call(getFirestore)
  yield call(
    firestore.get,
    {
      collection: 'organizations',
      doc: organizationId,
      subcollections: [
        {
          collection: 'aircrafts',
          doc: aircraftId,
          subcollections: [
            {
              collection: 'flights'
            }
          ]
        }
      ],
      where: ['deleted', '==', false],
      orderBy: ['blockOffTime', 'desc'],
      startAfter: startFlightDocument,
      limit: rowsPerPage,
      storeAs: `flights-${aircraftId}-${page}`,
      populate: ['departureAerodrome', 'destinationAerodrome', 'pilot']
    },
    {}
  )
}

export function* getCurrentMember() {
  const userId = yield select(uidSelector)
  const organizationMembers = yield select(organizationMembersSelector)
  const member = organizationMembers.find(m => m.user && m.user.id === userId)
  if (!member) {
    throw `Member not found for uid ${userId}`
  }
  return member
}

export function* getAerodrome(aerodromeId) {
  return yield call(getDoc, ['aerodromes', aerodromeId])
}

export function* getMember(organizationId, memberId) {
  return yield call(getDoc, [
    'organizations',
    organizationId,
    'members',
    memberId
  ])
}

export function* getFlight(organizationId, aircraftId, flightId) {
  return yield call(getDoc, [
    'organizations',
    organizationId,
    'aircrafts',
    aircraftId,
    'flights',
    flightId
  ])
}

export function* getLastFlight(organizationId, aircraftId) {
  const firestore = yield call(getFirestore)
  const lastFlight = yield call(
    firestore.get,
    {
      collection: 'organizations',
      doc: organizationId,
      subcollections: [
        {
          collection: 'aircrafts',
          doc: aircraftId,
          subcollections: [
            {
              collection: 'flights'
            }
          ]
        }
      ],
      where: ['deleted', '==', false],
      orderBy: ['blockOffTime', 'desc'],
      limit: 1
    },
    {}
  )
  return !lastFlight.empty ? lastFlight.docs[0].data() : null
}

export async function getDestinationAerodrome(flight) {
  if (flight.destinationAerodrome) {
    const document = await flight.destinationAerodrome.get()
    const data = document.data()
    data.id = flight.destinationAerodrome.id
    return data
  }
  return null
}

export const mergeDateAndTime = (date, time, timezone) => {
  const dateTimeFormat = 'YYYY-MM-DD HH:mm'
  const timeString = moment.tz(time, dateTimeFormat, timezone).format('HH:mm')
  return moment.tz(date + ' ' + timeString, dateTimeFormat, timezone).toDate()
}

export function* createFlight({
  payload: { organizationId, aircraftId, data }
}) {
  try {
    yield put(actions.setCreateFlightDialogSubmitting())

    const aircraftSettings = yield select(aircraftSettingsSelector, aircraftId)

    const validationErrors = yield call(validateFlight, data, aircraftSettings)
    if (
      validationErrors &&
      Object.getOwnPropertyNames(validationErrors).length > 0
    ) {
      yield put(actions.setFlightValidationErrors(validationErrors))
      return
    }

    const currentMember = yield call(getCurrentMember)

    const owner = yield call(getMember, organizationId, currentMember.id)
    const pilot = yield call(getMember, organizationId, data.pilot.value)
    const instructor =
      data.instructor && data.instructor.value
        ? yield call(getMember, organizationId, data.instructor.value)
        : null

    const departureAerodrome = yield call(
      getAerodrome,
      data.departureAerodrome.value
    )
    const destinationAerodrome = yield call(
      getAerodrome,
      data.destinationAerodrome.value
    )

    const departureTimezone = departureAerodrome.data().timezone
    const destinationTimezone = destinationAerodrome.data().timezone

    const fuelUplift =
      typeof data.fuelUplift === 'number' ? data.fuelUplift / 100 : null
    const fuelType =
      typeof fuelUplift === 'number' && fuelUplift > 0
        ? data.fuelType.value
        : null

    const oilUplift =
      typeof data.oilUplift === 'number' ? data.oilUplift / 100 : null

    const dataToStore = {
      deleted: false,
      owner: owner.ref,
      nature: data.nature.value,
      pilot: pilot.ref,
      instructor: instructor ? instructor.ref : null,
      departureAerodrome: departureAerodrome.ref,
      destinationAerodrome: destinationAerodrome.ref,
      blockOffTime: mergeDateAndTime(
        data.date,
        data.blockOffTime,
        departureTimezone
      ),
      takeOffTime: mergeDateAndTime(
        data.date,
        data.takeOffTime,
        departureTimezone
      ),
      landingTime: mergeDateAndTime(
        data.date,
        data.landingTime,
        destinationTimezone
      ),
      blockOnTime: mergeDateAndTime(
        data.date,
        data.blockOnTime,
        destinationTimezone
      ),
      counters: data.counters,
      landings: data.landings,
      fuelUplift,
      fuelType,
      fuelUnit: 'litre',
      oilUplift,
      oilUnit: 'litre',
      remarks: data.remarks || null
    }

    yield call(
      addDoc,
      ['organizations', organizationId, 'aircrafts', aircraftId, 'flights'],
      dataToStore
    )

    const { page, rowsPerPage } = yield select(aircraftFlightsViewSelector)
    yield put(
      actions.fetchFlights(organizationId, aircraftId, page, rowsPerPage)
    )
    yield put(actions.createFlightSuccess())
  } catch (e) {
    error(`Failed to create flight`, e)
    yield put(actions.createFlightFailure())
  }
}

/**
 * error message keys are automatically prefixed with
 * "flight.create.dialog.validation.{fieldName}." and transformed to lower case.
 *
 * e.g.: if { date: 'invalid' } is returned, the used message key will be
 * 'flight.create.dialog.validation.date.invalid'.
 *
 * @param data
 * @param aircraftSettings
 * @return a map containing the error message for the mapped fields
 */
export function validateFlight(data, aircraftSettings) {
  const errors = {}

  if (!data.date || !DATE_PATTERN.test(data.date)) {
    errors['date'] = 'invalid'
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
  if (!errors['blockOffTime'] && !errors['takeOffTime']) {
    if (data.takeOffTime < data.blockOffTime) {
      errors['takeOffTime'] = 'not_before_block_off_time'
    }
  }
  if (!errors['takeOffTime'] && !errors['landingTime']) {
    if (data.landingTime < data.takeOffTime) {
      errors['landingTime'] = 'not_before_take_off_time'
    }
  }
  if (!errors['landingTime'] && !errors['blockOnTime']) {
    if (data.blockOnTime < data.landingTime) {
      errors['blockOnTime'] = 'not_before_landing_time'
    }
  }
  if (typeof data.landings !== 'number' || data.landings < 1) {
    errors['landings'] = 'required'
  }
  if (data.fuelUplift) {
    if (typeof data.fuelUplift !== 'number' || data.fuelUplift < 0) {
      errors['fuelUplift'] = 'invalid'
    }
    if (!data.fuelType) {
      errors['fuelType'] = 'required'
    }
  }
  if (
    data.oilUplift &&
    (typeof data.oilUplift !== 'number' || data.oilUplift < 0)
  ) {
    errors['oilUplift'] = 'invalid'
  }

  const flightHoursStart = _get(data, 'counters.flightHours.start')
  const flightHoursEnd = _get(data, 'counters.flightHours.end')

  if (typeof flightHoursStart === 'undefined') {
    errors['counters.flightHours.start'] = 'required'
  }
  if (typeof flightHoursEnd === 'undefined') {
    errors['counters.flightHours.end'] = 'required'
  }
  if (flightHoursStart && flightHoursEnd) {
    if (flightHoursEnd < flightHoursStart) {
      errors['counters.flightHours.end'] = 'not_before_start_counter'
    }
  }

  if (aircraftSettings.engineHoursCounterEnabled === true) {
    const engineHoursStart = _get(data, 'counters.engineHours.start')
    const engineHoursEnd = _get(data, 'counters.engineHours.end')

    if (typeof engineHoursStart === 'undefined') {
      errors['counters.engineHours.start'] = 'required'
    }
    if (typeof engineHoursEnd === 'undefined') {
      errors['counters.engineHours.end'] = 'required'
    }
    if (engineHoursStart && engineHoursEnd) {
      if (engineHoursEnd < engineHoursStart) {
        errors['counters.engineHours.end'] = 'not_before_start_counter'
      }
    }
  }

  return errors
}

export function* initCreateFlightDialog({
  payload: { organizationId, aircraftId }
}) {
  const currentMember = yield call(getCurrentMember)
  const lastFlight = yield call(getLastFlight, organizationId, aircraftId)
  const departureAerodrome = lastFlight
    ? yield call(getDestinationAerodrome, lastFlight)
    : null

  const flightHoursStart = _get(lastFlight, 'counters.flightHours.end')
  const engineHoursStart = _get(lastFlight, 'counters.engineHours.end')

  const data = {
    date: moment().format('YYYY-MM-DD'),
    pilot: getMemberOption(currentMember),
    departureAerodrome: departureAerodrome
      ? getAerodromeOption(departureAerodrome)
      : null,
    counters: {
      flightHours: {
        start: flightHoursStart
      },
      engineHours: {
        start: engineHoursStart
      }
    }
  }

  const readOnlyFields = ['landingTime']
  if (departureAerodrome) readOnlyFields.push('departureAerodrome')
  if (flightHoursStart) readOnlyFields.push('counters.flightHours.start')
  if (engineHoursStart) readOnlyFields.push('counters.engineHours.start')

  yield put(actions.setInitialCreateFlightDialogData(data, readOnlyFields))
}

export function* deleteFlight({
  payload: { organizationId, aircraftId, flightId }
}) {
  yield call(
    updateDoc,
    [
      'organizations',
      organizationId,
      'aircrafts',
      aircraftId,
      'flights',
      flightId
    ],
    {
      deleted: true
    }
  )
  const { page, rowsPerPage } = yield select(aircraftFlightsViewSelector)
  yield put(actions.fetchFlights(organizationId, aircraftId, page, rowsPerPage))
  yield put(actions.closeDeleteFlightDialog())
}

export default function* sagas() {
  yield all([
    fork(takeEvery, actions.FETCH_FLIGHTS, fetchFlights),
    fork(takeEvery, actions.CREATE_FLIGHT, createFlight),
    fork(takeEvery, actions.INIT_CREATE_FLIGHT_DIALOG, initCreateFlightDialog),
    fork(takeEvery, actions.DELETE_FLIGHT, deleteFlight)
  ])
}
