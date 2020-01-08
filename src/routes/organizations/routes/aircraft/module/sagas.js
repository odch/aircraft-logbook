import { takeEvery, all, call, put, select } from 'redux-saga/effects'
import moment from 'moment-timezone'
import { getFirestore } from '../../../../../util/firebase'
import * as actions from './actions'
import { getMemberOption, getAerodromeOption } from '../util/getOptions'
import { error } from '../../../../../util/log'
import { getDoc, addDoc, updateDoc } from '../../../../../util/firestoreUtils'
import getLastFlight from './util/getLastFlight'
import { validateSync, validateAsync } from './util/validateFlight'
import { getCounters } from './util/counters'
import { fetchAerodromes } from '../../../module/actions'

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
      populate: [
        'departureAerodrome',
        'destinationAerodrome',
        'pilot',
        'instructor'
      ]
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

export function* getAerodrome(organizationId, aerodromeId) {
  let aerodrome = yield call(getDoc, ['aerodromes', aerodromeId])
  if (aerodrome.exists !== true) {
    aerodrome = yield call(getDoc, [
      'organizations',
      organizationId,
      'aerodromes',
      aerodromeId
    ])
  }
  if (aerodrome.exists !== true) {
    throw new Error(`Aeorodrome not found for id ${aerodromeId}`)
  }
  return aerodrome
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

export async function getDestinationAerodrome(flight) {
  if (flight.destinationAerodrome) {
    if (typeof flight.destinationAerodrome.get === 'function') {
      const document = await flight.destinationAerodrome.get()
      const data = document.data()
      data.id = flight.destinationAerodrome.id
      return data
    }
    return flight.destinationAerodrome
  }
  return null
}

export const mergeDateAndTime = (date, time, timezone) => {
  const dateTimeFormat = 'YYYY-MM-DD HH:mm'
  const timeString = moment.tz(time, dateTimeFormat, timezone).format('HH:mm')
  return moment.tz(date + ' ' + timeString, dateTimeFormat, timezone).toDate()
}

export const aerodromeObject = aeodromeDocument => ({
  name: aeodromeDocument.get('name') || null,
  identification: aeodromeDocument.get('identification') || null,
  timezone: aeodromeDocument.get('timezone') || null,
  aerodrome: aeodromeDocument.ref,
  id: aeodromeDocument.id
})

export const memberObject = memberDocument =>
  memberDocument && memberDocument.exists
    ? {
        firstname: memberDocument.get('firstname') || null,
        lastname: memberDocument.get('lastname') || null,
        nr: memberDocument.get('nr') || null,
        member: memberDocument.ref,
        id: memberDocument.id
      }
    : null

export function* createFlight({
  payload: { organizationId, aircraftId, data }
}) {
  try {
    yield put(actions.setCreateFlightDialogSubmitting())

    const aircraftSettings = yield select(aircraftSettingsSelector, aircraftId)

    let validationErrors = yield call(
      validateSync,
      data,
      organizationId,
      aircraftId,
      aircraftSettings
    )
    if (Object.getOwnPropertyNames(validationErrors).length > 0) {
      yield put(actions.setFlightValidationErrors(validationErrors))
      return
    }

    const departureAerodrome = yield call(
      getAerodrome,
      organizationId,
      data.departureAerodrome.value
    )
    const destinationAerodrome = yield call(
      getAerodrome,
      organizationId,
      data.destinationAerodrome.value
    )

    const counters = getCounters(data)

    data = {
      ...data,
      blockOffTime: mergeDateAndTime(
        data.date,
        data.blockOffTime,
        departureAerodrome.get('timezone')
      ),
      takeOffTime: mergeDateAndTime(
        data.date,
        data.takeOffTime,
        departureAerodrome.get('timezone')
      ),
      landingTime: mergeDateAndTime(
        data.date,
        data.landingTime,
        destinationAerodrome.get('timezone')
      ),
      blockOnTime: mergeDateAndTime(
        data.date,
        data.blockOnTime,
        destinationAerodrome.get('timezone')
      )
    }

    validationErrors = yield call(
      validateAsync,
      data,
      organizationId,
      aircraftId
    )
    if (Object.getOwnPropertyNames(validationErrors).length > 0) {
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
      pilot: memberObject(pilot),
      instructor: memberObject(instructor),
      departureAerodrome: aerodromeObject(departureAerodrome),
      destinationAerodrome: aerodromeObject(destinationAerodrome),
      blockOffTime: data.blockOffTime,
      takeOffTime: data.takeOffTime,
      landingTime: data.landingTime,
      blockOnTime: data.blockOnTime,
      counters,
      landings: data.landings,
      personsOnBoard: data.personsOnBoard,
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

    const { rowsPerPage } = yield select(aircraftFlightsViewSelector)
    yield put(actions.fetchFlights(organizationId, aircraftId, 0, rowsPerPage))
    yield put(actions.setFlightsPage(0))
    yield put(actions.createFlightSuccess())
  } catch (e) {
    error(`Failed to create flight`, e)
    yield put(actions.createFlightFailure())
  }
}

export function* initCreateFlightDialog({
  payload: { organizationId, aircraftId }
}) {
  const aircraftSettings = yield select(aircraftSettingsSelector, aircraftId)
  const currentMember = yield call(getCurrentMember)
  const lastFlight = yield call(getLastFlight, organizationId, aircraftId)

  const counterNames = [
    'flights',
    'landings',
    'flightHours',
    'flightTimeCounter'
  ]

  if (aircraftSettings.engineHoursCounterEnabled === true) {
    counterNames.push('engineTimeCounter')
    counterNames.push('engineHours')
  }

  const counters = initCounters(counterNames)

  let departureAerodrome

  if (lastFlight) {
    departureAerodrome = yield call(getDestinationAerodrome, lastFlight)
    setStartCounters(counters, lastFlight.counters || {}, counterNames)
  }

  if (typeof counters.flights.start === 'undefined') {
    counters.flights.start = 0
  }

  const data = {
    date: moment().format('YYYY-MM-DD'),
    pilot: getMemberOption(currentMember),
    departureAerodrome: departureAerodrome
      ? getAerodromeOption(departureAerodrome)
      : null,
    counters,
    blockOffTime: null,
    takeOffTime: null,
    landingTime: null,
    blockOnTime: null
  }

  yield put(actions.setInitialCreateFlightDialogData(data))
}

export function initCounters(names) {
  const counters = {}
  names.forEach(name => {
    counters[name] = {}
  })
  return counters
}

export function setStartCounters(target, source, counterNames) {
  counterNames.forEach(counterName => {
    if (source[counterName] && source[counterName].end) {
      target[counterName].start = source[counterName].end
    }
  })
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

export function* createAerodrome({
  payload: { organizationId, fieldName, data }
}) {
  try {
    yield put(actions.setCreateAerodromeDialogSubmitting())
    const dataToStore = {
      identification: data.identification,
      name: data.name,
      timezone: data.timezone.value,
      deleted: false
    }
    const doc = yield call(
      addDoc,
      ['organizations', organizationId, 'aerodromes'],
      dataToStore
    )
    yield put(
      actions.updateCreateFlightDialogData({
        [fieldName]: {
          value: doc.id,
          label: `${data.identification} (${data.name})`
        }
      })
    )
    yield put(fetchAerodromes(organizationId))
    yield put(actions.createAeorodromeSuccess())
  } catch (e) {
    error(`Failed to add aerodrome ${data.identification} ${data.name}`, e)
    yield put(actions.createAeorodromeFailure())
  }
}

export default function* sagas() {
  yield all([
    takeEvery(actions.FETCH_FLIGHTS, fetchFlights),
    takeEvery(actions.CREATE_FLIGHT, createFlight),
    takeEvery(actions.INIT_CREATE_FLIGHT_DIALOG, initCreateFlightDialog),
    takeEvery(actions.DELETE_FLIGHT, deleteFlight),
    takeEvery(actions.CREATE_AERODROME, createAerodrome)
  ])
}
