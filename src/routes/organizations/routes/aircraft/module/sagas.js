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
  serverTimestamp
} from '../../../../../util/firestoreUtils'
import getLastFlight from './util/getLastFlight'
import { fetchAerodromes, fetchAircrafts } from '../../../module/actions'
import { isClosed } from '../../../../../util/techlogStatus'
import { getCurrentMember, getCurrentMemberObject } from '../../../util/members'

export const flightPageName = (aircraftId, page, showDeleted) =>
  `${showDeleted ? 'flights-all' : 'flights'}-${aircraftId}-${page}`

export const flightsSelector = (aircraftId, page, showDeleted) => state =>
  state.firestore.ordered[flightPageName(aircraftId, page, showDeleted)]
export const techlogPageSelector = (aircraftId, page) => state =>
  state.firestore.ordered[`techlog-${aircraftId}-${page}`]
export const openTechlogEntriesSelector = aircraftId => state =>
  state.firestore.ordered[`techlog-${aircraftId}-open`]
export const aircraftFlightsViewSelector = state => state.aircraft.flights
export const aircraftTechlogViewSelector = state => state.aircraft.techlog
export const aircraftSettingsSelector = (state, aircraftId) =>
  state.firestore.data.organizationAircrafts[aircraftId].settings || {}

export function* getStartFlightDocument(
  organizationId,
  aircraftId,
  page,
  showDeleted
) {
  if (page === 0) {
    return null
  }
  const previousPage = yield select(
    flightsSelector(aircraftId, page - 1, showDeleted)
  )
  if (previousPage && previousPage.length > 0) {
    const lastFlight = previousPage[previousPage.length - 1]
    return yield call(getFlight, organizationId, aircraftId, lastFlight.id)
  }
  return null
}

export function* initFlightsList({
  payload: { organizationId, aircraftId, rowsPerPage, showDeleted }
}) {
  yield put(
    actions.setFlightsParams(
      organizationId,
      aircraftId,
      rowsPerPage,
      showDeleted
    )
  )
  yield call(fetchFlights)
}

export function* changeFlightsPage({ payload: { page } }) {
  yield put(actions.setFlightsPage(page))
  yield call(fetchFlights)
}

export function* queryFlights(
  organizationId,
  aircraftId,
  page,
  rowsPerPage,
  showDeleted
) {
  const startFlightDocument = yield call(
    getStartFlightDocument,
    organizationId,
    aircraftId,
    page,
    showDeleted
  )

  const where = showDeleted ? [] : ['deleted', '==', false]
  const orderBy = showDeleted
    ? [
        ['blockOffTime', 'desc'],
        ['version', 'desc']
      ]
    : ['blockOffTime', 'desc']

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
      where,
      orderBy,
      startAfter: startFlightDocument,
      limit: rowsPerPage,
      storeAs: flightPageName(aircraftId, page, showDeleted),
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

export function* fetchFlights() {
  const {
    organizationId,
    aircraftId,
    page,
    rowsPerPage,
    showDeleted
  } = yield select(aircraftFlightsViewSelector)
  const effects = [
    call(queryFlights, organizationId, aircraftId, page, rowsPerPage, false)
  ]
  if (showDeleted) {
    effects.push(
      call(queryFlights, organizationId, aircraftId, page, rowsPerPage, true)
    )
  }
  yield all(effects)
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

export const extractDate = (timestamp, timezone) =>
  moment(timestamp.toDate()).tz(timezone).format('YYYY-MM-DD')

export const getTimeForPicker = (timestamp, timezone) =>
  moment(timestamp.toDate()).tz(timezone).format('YYYY-MM-DD HH:mm')

export function* createFlight({
  payload: { organizationId, aircraftId, data }
}) {
  try {
    yield put(actions.setCreateFlightDialogSubmitting())

    const dataToSave = {
      ...data,
      techlogEntryAttachments: yield call(
        getAttachments,
        data.techlogEntryAttachments || []
      )
    }

    const result = yield call(callFunction, 'saveFlight', {
      organizationId,
      aircraftId,
      data: dataToSave,
      techlogEntryClosed:
        data.techlogEntryStatus && data.techlogEntryStatus.value
          ? isClosed(data.techlogEntryStatus.value)
          : null
    })

    if (
      result.data &&
      result.data.validationErrors &&
      Object.getOwnPropertyNames(result.data.validationErrors).length > 0
    ) {
      yield put(actions.setFlightValidationErrors(result.data.validationErrors))
      return
    }

    if (result.data && result.data.techlogEntryAdded) {
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
    blockOffTime: moment().endOf('day').format('YYYY-MM-DD HH:mm'),
    takeOffTime: null,
    landingTime: null,
    blockOnTime: null
  }

  yield put(
    actions.setInitialCreateFlightDialogData(
      data,
      [
        'date',
        'pilot',
        'instructor',
        'nature',
        'departureAerodrome',
        'counters.flightTimeCounter.start',
        ...(aircraftSettings.engineHoursCounterEnabled === true
          ? ['counters.engineTimeCounter.start']
          : []),
        'personsOnBoard',
        'fuelUplift',
        'fuelType',
        'oilUplift',
        'preflightCheck'
      ],
      [
        'date',
        'pilot',
        'instructor',
        'nature',
        'personsOnBoard',
        'fuelUplift',
        'fuelType',
        'oilUplift',
        'preflightCheck'
      ]
    )
  )
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

export function toFuelTypeOption(aircraftSettings, fuelTypeName) {
  const typeObj = aircraftSettings.fuelTypes.find(
    type => type.name === fuelTypeName
  ) || { name: fuelTypeName }
  return getFuelTypeOption(typeObj)
}

export function* initCreateCorrectionFlightDialog({
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

  const data = {
    date: moment().format('YYYY-MM-DD'),
    time: null,
    pilot: getMemberOption(currentMember),
    aerodrome: departureAerodrome
      ? getAerodromeOption(departureAerodrome)
      : null,
    counters
  }

  yield put(actions.setInitialCreateCorrectionFlightDialogData(data))
}

export const getCorrections = data => {
  const corrections = {}

  if (
    data.aerodrome &&
    data.newAerodrome &&
    data.aerodrome.value !== data.newAerodrome.value
  ) {
    corrections.aerodrome = {
      start: data.aerodrome.label,
      end: data.newAerodrome.label
    }
  }

  for (const [counterName, counter] of Object.entries(data.counters)) {
    if (typeof counter.end === 'number' && counter.start !== counter.end) {
      corrections[counterName] = {
        start: counter.start,
        end: counter.end
      }
    }
  }

  return corrections
}

export function* createCorrectionFlight({
  payload: { organizationId, aircraftId, data, confirmed }
}) {
  try {
    if (confirmed !== true) {
      const corrections = getCorrections(data)
      yield put(actions.setCorrectionFlightCorrections(corrections))
      return
    }

    yield put(actions.setCreateCorrectionFlightDialogSubmitting())

    const result = yield call(callFunction, 'saveCorrectionFlight', {
      organizationId,
      aircraftId,
      data
    })

    if (
      result.data &&
      result.data.validationErrors &&
      Object.getOwnPropertyNames(result.data.validationErrors).length > 0
    ) {
      yield put(
        actions.setCorrectionFlightValidationErrors(
          result.data.validationErrors
        )
      )
      return
    }

    yield put(actions.changeFlightsPage(0))
    yield put(actions.createCorrectionFlightSuccess())
  } catch (e) {
    error(`Failed to create correction flight`, e)
    yield put(actions.createCorrectionFlightFailure())
  }
}

const getEditFormFields = (flight, aircraftSettings) =>
  flight.get('version') === 0
    ? {
        visibleFields: [
          'date',
          'pilot',
          'instructor',
          'nature',
          'departureAerodrome',
          'destinationAerodrome',
          'counters.flightTimeCounter.start',
          'counters.flightTimeCounter.end',
          ...(aircraftSettings.engineHoursCounterEnabled === true
            ? [
                'counters.engineTimeCounter.start',
                'counters.engineTimeCounter.end'
              ]
            : []),
          'blockOffTime',
          'takeOffTime',
          'landingTime',
          'blockOnTime',
          'landings',
          'personsOnBoard',
          'fuelUplift',
          'fuelType',
          'oilUplift',
          'remarks',
          'troublesObservations',
          'techlogEntryStatus',
          'techlogEntryDescription'
        ],
        editableFields: [
          'pilot',
          'instructor',
          'nature',
          'destinationAerodrome',
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
          'remarks',
          'troublesObservations',
          'techlogEntryStatus',
          'techlogEntryDescription'
        ]
      }
    : {
        visibleFields: [
          'date',
          'pilot',
          'instructor',
          'nature',
          'departureAerodrome',
          'destinationAerodrome',
          'counters.flightTimeCounter.start',
          'counters.flightTimeCounter.end',
          ...(aircraftSettings.engineHoursCounterEnabled === true
            ? [
                'counters.engineTimeCounter.start',
                'counters.engineTimeCounter.end'
              ]
            : []),
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
        editableFields: [
          'pilot',
          'instructor',
          'nature',
          'personsOnBoard',
          'fuelUplift',
          'fuelType',
          'oilUplift',
          'remarks'
        ]
      }

export function* openAndInitEditFlightDialog({
  payload: { organizationId, aircraftId, flightId }
}) {
  yield put(actions.openCreateFlightDialog())
  const aircraftSettings = yield select(aircraftSettingsSelector, aircraftId)
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
    preflightCheck,
    troublesObservations,
    techlogEntryDescription,
    techlogEntryStatus,
    version
  }) => ({
    id: flight.id,
    version,
    date: extractDate(blockOffTime, departureAerodrome.timezone),
    pilot: getMemberOption(pilot),
    instructor: instructor ? getMemberOption(instructor) : null,
    nature,
    departureAerodrome: getAerodromeOption(departureAerodrome),
    destinationAerodrome: destinationAerodrome
      ? getAerodromeOption(destinationAerodrome)
      : null,
    blockOffTime:
      version === 0
        ? null
        : getTimeForPicker(blockOffTime, departureAerodrome.timezone),
    takeOffTime: takeOffTime
      ? getTimeForPicker(takeOffTime, departureAerodrome.timezone)
      : null,
    landingTime: landingTime
      ? getTimeForPicker(landingTime, destinationAerodrome.timezone)
      : null,
    blockOnTime: blockOnTime
      ? getTimeForPicker(blockOnTime, destinationAerodrome.timezone)
      : null,
    landings,
    personsOnBoard,
    fuelUplift: typeof fuelUplift === 'number' ? fuelUplift * 100 : null,
    fuelType: fuelType ? toFuelTypeOption(aircraftSettings, fuelType) : null,
    oilUplift: typeof oilUplift === 'number' ? oilUplift * 100 : null,
    remarks: remarks || '',
    counters,
    preflightCheck,
    troublesObservations,
    techlogEntryDescription,
    techlogEntryStatus
  }))(flight.data())
  const { visibleFields, editableFields } = getEditFormFields(
    flight,
    aircraftSettings
  )
  yield put(
    actions.setInitialCreateFlightDialogData(
      data,
      visibleFields,
      editableFields
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
      deleted: true,
      deletedBy: yield call(getCurrentMemberObject, organizationId),
      deleteTimestamp: yield call(serverTimestamp)
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
      where: [
        ['deleted', '==', false],
        ['closed', '==', false]
      ],
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

export function* fetchLatestCrs({ payload: { organizationId, aircraftId } }) {
  const firestore = yield call(getFirestore)
  const latestCrsSnapshot = yield call(
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
      where: [
        ['deleted', '==', false],
        ['closed', '==', true],
        ['currentStatus', '==', 'crs']
      ],
      orderBy: ['closedTimestamp', 'desc'],
      limit: 1,
      storeAs: `latest-crs-${aircraftId}`
    },
    {}
  )
  if (latestCrsSnapshot.size === 1) {
    const techlogEntryId = latestCrsSnapshot.docs[0].ref.id
    yield getTechlogActionsQuery(
      firestore,
      organizationId,
      aircraftId,
      techlogEntryId
    )
  }
}

export const getBase64 = file =>
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
    yield put(actions.fetchLatestCrs(organizationId, aircraftId))
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
    yield put(actions.fetchLatestCrs(organizationId, aircraftId))
    yield put(actions.createTechlogEntryActionSuccess())
  } catch (e) {
    error('Failed to create techlog entry action', e)
    yield put(actions.createTechlogEntryActionFailure())
  }
}

export function* fetchChecks({ payload: { organizationId, aircraftId } }) {
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
              collection: 'checks'
            }
          ]
        }
      ],
      where: [['deleted', '==', false]],
      orderBy: 'description',
      storeAs: `checks-${aircraftId}`
    },
    {}
  )
}

export default function* sagas() {
  yield all([
    takeEvery(actions.INIT_FLIGHTS_LIST, initFlightsList),
    takeEvery(actions.CHANGE_FLIGHTS_PAGE, changeFlightsPage),
    takeEvery(actions.FETCH_FLIGHTS, fetchFlights),
    takeEvery(actions.CREATE_FLIGHT, createFlight),
    takeEvery(actions.INIT_CREATE_FLIGHT_DIALOG, initCreateFlightDialog),
    takeEvery(
      actions.OPEN_CREATE_CORRECTION_FLIGHT_DIALOG,
      initCreateCorrectionFlightDialog
    ),
    takeEvery(actions.CREATE_CORRECTION_FLIGHT, createCorrectionFlight),
    takeEvery(actions.OPEN_EDIT_FLIGHT_DIALOG, openAndInitEditFlightDialog),
    takeEvery(actions.DELETE_FLIGHT, deleteFlight),
    takeEvery(actions.CREATE_AERODROME, createAerodrome),
    takeEvery(actions.INIT_TECHLOG, initTechlog),
    takeEvery(actions.CHANGE_TECHLOG_PAGE, changeTechlogPage),
    takeEvery(actions.CREATE_TECHLOG_ENTRY, createTechlogEntry),
    takeEvery(actions.CREATE_TECHLOG_ENTRY_ACTION, createTechlogEntryAction),
    takeEvery(actions.FETCH_LATEST_CRS, fetchLatestCrs),
    takeEvery(actions.FETCH_CHECKS, fetchChecks)
  ])
}
