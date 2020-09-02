import { takeEvery, all, call, put, select } from 'redux-saga/effects'
import moment from 'moment-timezone'
import { getFirestore, callFunction } from '../../../../../util/firebase'
import * as actions from './actions'
import {
  getMemberOption,
  getAerodromeOption,
  getFuelTypeOption
} from '../util/getOptions'
import { error } from '../../../../../util/log'
import {
  getDoc,
  addDoc,
  updateDoc,
  runTransaction
} from '../../../../../util/firestoreUtils'
import getLastFlight from './util/getLastFlight'
import { validateSync, validateAsync } from './util/validateFlight'
import { getCounters } from './util/counters'
import { fetchAerodromes, fetchAircrafts } from '../../../module/actions'
import { isClosed } from '../../../../../util/techlogStatus'

export const uidSelector = state => state.firebase.auth.uid
export const organizationMembersSelector = state =>
  state.firestore.ordered.organizationMembers
export const flightsSelector = (aircraftId, page) => state =>
  state.firestore.ordered[`flights-${aircraftId}-${page}`]
export const techlogPageSelector = (aircraftId, page) => state =>
  state.firestore.ordered[`techlog-${aircraftId}-${page}`]
export const openTechlogEntriesSelector = aircraftId => state =>
  state.firestore.ordered[`techlog-${aircraftId}-open`]
export const aircraftFlightsViewSelector = state => state.aircraft.flights
export const aircraftTechlogViewSelector = state => state.aircraft.techlog
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

export function* initFlightsList({
  payload: { organizationId, aircraftId, rowsPerPage }
}) {
  yield put(actions.setFlightsParams(organizationId, aircraftId, rowsPerPage))
  yield call(fetchFlights)
}

export function* changeFlightsPage({ payload: { page } }) {
  yield put(actions.setFlightsPage(page))
  yield call(fetchFlights)
}

export function* fetchFlights() {
  const { organizationId, aircraftId, page, rowsPerPage } = yield select(
    aircraftFlightsViewSelector
  )
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

export function* getTechlogEntry(organizationId, aircraftId, techlogEntryId) {
  return yield call(getDoc, [
    'organizations',
    organizationId,
    'aircrafts',
    aircraftId,
    'techlog',
    techlogEntryId
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

export const extractDate = (timestamp, timezone) =>
  moment(timestamp.toDate())
    .tz(timezone)
    .format('YYYY-MM-DD')

export const getTimeForPicker = (timestamp, timezone) =>
  moment(timestamp.toDate())
    .tz(timezone)
    .format('YYYY-MM-DD HH:mm')

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
      nature: typeof data.nature === 'string' ? data.nature : data.nature.value,
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
      remarks: data.remarks || null,
      troublesObservations: data.troublesObservations,
      techlogEntryDescription: data.techlogEntryDescription
        ? data.techlogEntryDescription.trim()
        : null,
      techlogEntryStatus: data.techlogEntryStatus
        ? data.techlogEntryStatus.value
        : null
    }

    const oldFlightDoc = data.id
      ? yield call(getDoc, [
          'organizations',
          organizationId,
          'aircrafts',
          aircraftId,
          'flights',
          data.id
        ])
      : null
    const newFlightDoc = yield call(addNewFlightDoc, organizationId, aircraftId)
    yield call(
      runTransaction,
      setFlightData,
      oldFlightDoc,
      newFlightDoc,
      dataToStore
    )

    if (data.troublesObservations === 'troubles') {
      const entry = {
        description: data.techlogEntryDescription.trim(),
        initialStatus: data.techlogEntryStatus.value,
        currentStatus: data.techlogEntryStatus.value,
        closed: isClosed(data.techlogEntryStatus.value),
        flight: newFlightDoc.id,
        attachments: yield call(
          getAttachments,
          data.techlogEntryAttachments || []
        )
      }
      yield call(callFunction, 'addTechlogEntry', {
        organizationId,
        aircraftId,
        entry
      })
      yield put(fetchAircrafts(organizationId))
      yield call(fetchTechlog)
    }

    yield put(actions.changeFlightsPage(0))
    yield put(actions.createFlightSuccess())
  } catch (e) {
    error(`Failed to create flight`, e)
    yield put(actions.createFlightFailure())
  }
}

export function* addNewFlightDoc(organizationId, aircraftId) {
  const newDoc = yield call(
    addDoc,
    ['organizations', organizationId, 'aircrafts', aircraftId, 'flights'],
    { deleted: true }
  )
  // fetch again with ref
  return yield call(getDoc, [
    'organizations',
    organizationId,
    'aircrafts',
    aircraftId,
    'flights',
    newDoc.id
  ])
}

export const setFlightData = (
  oldFlightDoc,
  newFlightDoc,
  dataToStore
) => async tx => {
  if (oldFlightDoc) {
    tx.update(oldFlightDoc.ref, {
      deleted: true,
      replacedWith: newFlightDoc.id
    })
    dataToStore.replaces = oldFlightDoc.id
  }
  tx.update(newFlightDoc.ref, dataToStore)
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

export function* openAndInitEditFlightDialog({
  payload: { organizationId, aircraftId, flightId }
}) {
  yield put(actions.openCreateFlightDialog())
  const flight = yield call(getFlight, organizationId, aircraftId, flightId)
  const data = (({
    pilot,
    instructor,
    nature,
    departureAerodrome,
    destinationAerodrome,
    blockOffTime,
    takeOffTime,
    landingTime,
    blockOnTime,
    landings,
    personsOnBoard,
    fuelUplift,
    fuelType,
    oilUplift,
    remarks,
    counters,
    troublesObservations,
    techlogEntryDescription,
    techlogEntryStatus
  }) => ({
    id: flight.id,
    date: extractDate(blockOffTime, departureAerodrome.timezone),
    pilot: getMemberOption(pilot),
    instructor: instructor ? getMemberOption(instructor) : null,
    nature,
    departureAerodrome: getAerodromeOption(departureAerodrome),
    destinationAerodrome: getAerodromeOption(destinationAerodrome),
    blockOffTime: getTimeForPicker(blockOffTime, departureAerodrome.timezone),
    takeOffTime: getTimeForPicker(takeOffTime, departureAerodrome.timezone),
    landingTime: getTimeForPicker(landingTime, destinationAerodrome.timezone),
    blockOnTime: getTimeForPicker(blockOnTime, destinationAerodrome.timezone),
    landings,
    personsOnBoard,
    fuelUplift: fuelUplift || 0,
    fuelType: fuelType ? getFuelTypeOption(fuelType) : null,
    oilUplift,
    remarks: remarks || '',
    counters,
    troublesObservations,
    techlogEntryDescription,
    techlogEntryStatus
  }))(flight.data())
  yield put(
    actions.setInitialCreateFlightDialogData(
      data,
      [
        'date',
        'pilot',
        'instructor',
        'nature',
        'departureAerodrome',
        'destinationAerodrome',
        'counters.flightTimeCounter.start',
        'counters.flightTimeCounter.end',
        'blockOffTime',
        'takeOffTime',
        'landingTime',
        'blockOnTime',
        'landings',
        'personsOnBoard',
        'fuelUplift',
        'fuelType',
        'oilUplift',
        'remarks'
      ],
      [
        'pilot',
        'instructor',
        'nature',
        'personsOnBoard',
        'fuelUplift',
        'fuelType',
        'oilUplift',
        'remarks'
      ]
    )
  )
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
  yield put(actions.fetchFlights())
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
          label: `${data.identification} (${data.name})`,
          timezone: data.timezone.value
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

export function* initTechlog({
  payload: { organizationId, aircraftId, showOnlyOpen }
}) {
  yield put(actions.setTechlogParams(organizationId, aircraftId, showOnlyOpen))
  yield call(fetchTechlog)
}

export function* changeTechlogPage({ payload: { page } }) {
  yield put(actions.setTechlogPage(page))
  yield call(fetchTechlog)
}

export function* getStartTechlogDocument(organizationId, aircraftId, page) {
  if (page === 0) {
    return null
  }
  const previousPage = yield select(techlogPageSelector(aircraftId, page - 1))
  if (previousPage && previousPage.length > 0) {
    const lastEntry = previousPage[previousPage.length - 1]
    return yield call(getTechlogEntry, organizationId, aircraftId, lastEntry.id)
  }
  return null
}

export function* fetchTechlog() {
  const {
    organizationId,
    aircraftId,
    page,
    rowsPerPage,
    showOnlyOpen
  } = yield select(aircraftTechlogViewSelector)
  if (organizationId && aircraftId) {
    const firestore = yield call(getFirestore)
    const techlogEntries = yield showOnlyOpen
      ? call(fetchOpenTechlogEntries, firestore, organizationId, aircraftId)
      : call(
          fetchTechlogPage,
          firestore,
          organizationId,
          aircraftId,
          page,
          rowsPerPage
        )
    yield call(
      fetchTechlogActions,
      firestore,
      organizationId,
      aircraftId,
      techlogEntries
    )
  }
}

export function* fetchOpenTechlogEntries(
  firestore,
  organizationId,
  aircraftId
) {
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
              collection: 'techlog'
            }
          ]
        }
      ],
      where: [['deleted', '==', false], ['closed', '==', false]],
      orderBy: ['timestamp', 'desc'],
      storeAs: `techlog-${aircraftId}-open`
    },
    {}
  )
  return yield select(openTechlogEntriesSelector(aircraftId))
}

export function* fetchTechlogPage(
  firestore,
  organizationId,
  aircraftId,
  page,
  rowsPerPage
) {
  const startDocument = yield call(
    getStartTechlogDocument,
    organizationId,
    aircraftId,
    page
  )
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
              collection: 'techlog'
            }
          ]
        }
      ],
      where: [['deleted', '==', false]],
      orderBy: ['timestamp', 'desc'],
      startAfter: startDocument,
      limit: rowsPerPage,
      storeAs: `techlog-${aircraftId}-${page}`
    },
    {}
  )
  return yield select(techlogPageSelector(aircraftId, page))
}

export function* fetchTechlogActions(
  firestore,
  organizationId,
  aircraftId,
  techlogEntries
) {
  yield all(
    techlogEntries.map(entry =>
      getTechlogActionsQuery(firestore, organizationId, aircraftId, entry.id)
    )
  )
}

const getTechlogActionsQuery = (
  firestore,
  organizationId,
  aircraftId,
  techlogEntryId
) =>
  call(
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
              collection: 'techlog',
              doc: techlogEntryId,
              subcollections: [
                {
                  collection: 'actions'
                }
              ]
            }
          ]
        }
      ],
      orderBy: 'timestamp',
      storeAs: `techlog-entry-actions-${techlogEntryId}`
    },
    {}
  )

const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = e => {
      reject(e)
    }
  })

export function* getAttachments(attachments) {
  return yield all(
    attachments.map(attachment => call(getAttachment, attachment))
  )
}

export function* getAttachment(attachment) {
  const base64 = yield call(getBase64, attachment)
  return {
    name: attachment.name,
    base64,
    contentType: attachment.type
  }
}

export function* createTechlogEntry({
  payload: { organizationId, aircraftId, data }
}) {
  try {
    yield put(actions.setCreateTechlogEntryDialogSubmitting())
    const entry = {
      description: data.description,
      initialStatus: data.status.value,
      currentStatus: data.status.value,
      closed: isClosed(data.status.value),
      flight: null,
      attachments: yield call(getAttachments, data.attachments)
    }
    yield call(callFunction, 'addTechlogEntry', {
      organizationId,
      aircraftId,
      entry
    })
    yield put(fetchAircrafts(organizationId))
    yield call(fetchTechlog)
    yield put(actions.createTechlogEntrySuccess())
  } catch (e) {
    error('Failed to create techlog entry', e)
    yield put(actions.createTechlogEntryFailure())
  }
}

export function* createTechlogEntryAction({
  payload: { organizationId, aircraftId, techlogEntryId, data }
}) {
  try {
    yield put(actions.setCreateTechlogEntryActionDialogSubmitting())
    const action = {
      description: data.description,
      status: data.status.value,
      attachments: yield call(getAttachments, data.attachments)
    }
    if (data.signature) {
      action.signature = data.signature
    }
    yield call(callFunction, 'addTechlogEntryAction', {
      organizationId,
      aircraftId,
      techlogEntryId,
      techlogEntryClosed: isClosed(data.status.value),
      action
    })
    yield put(fetchAircrafts(organizationId))
    yield call(fetchTechlog)
    yield put(actions.createTechlogEntryActionSuccess())
  } catch (e) {
    error('Failed to create techlog entry action', e)
    yield put(actions.createTechlogEntryActionFailure())
  }
}

export default function* sagas() {
  yield all([
    takeEvery(actions.INIT_FLIGHTS_LIST, initFlightsList),
    takeEvery(actions.CHANGE_FLIGHTS_PAGE, changeFlightsPage),
    takeEvery(actions.FETCH_FLIGHTS, fetchFlights),
    takeEvery(actions.CREATE_FLIGHT, createFlight),
    takeEvery(actions.INIT_CREATE_FLIGHT_DIALOG, initCreateFlightDialog),
    takeEvery(actions.OPEN_EDIT_FLIGHT_DIALOG, openAndInitEditFlightDialog),
    takeEvery(actions.DELETE_FLIGHT, deleteFlight),
    takeEvery(actions.CREATE_AERODROME, createAerodrome),
    takeEvery(actions.INIT_TECHLOG, initTechlog),
    takeEvery(actions.CHANGE_TECHLOG_PAGE, changeTechlogPage),
    takeEvery(actions.CREATE_TECHLOG_ENTRY, createTechlogEntry),
    takeEvery(actions.CREATE_TECHLOG_ENTRY_ACTION, createTechlogEntryAction)
  ])
}
