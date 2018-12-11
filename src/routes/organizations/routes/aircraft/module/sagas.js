import { fork, takeEvery, all, call, put, select } from 'redux-saga/effects'
import moment from 'moment'
import { getFirestore } from '../../../../../util/firebase'
import * as actions from './actions'
import { getMemberOption } from '../util/getOptions'
import { error } from '../../../../../util/log'
import { getDoc, addDoc, updateDoc } from '../../../../../util/firestoreUtils'

export const uidSelector = state => state.firebase.auth.uid
export const organizationMembersSelector = state =>
  state.firestore.ordered.organizationMembers

export function* fetchFlights({ payload: { organizationId, aircraftId } }) {
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
      limit: 5,
      storeAs: 'flights-' + aircraftId,
      populate: ['departureAerodrome', 'destinationAerodrome', 'member']
    },
    {}
  )
}

export function* getCurrentMember() {
  const userId = yield select(uidSelector)
  const organizationMembers = yield select(organizationMembersSelector)
  const member = organizationMembers.find(m => m.user.id === userId)
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

export const mergeDateAndTime = (date, time) => {
  const timeString = moment(time).format('HH:mm')
  return moment(date + ' ' + timeString).toDate()
}

export function* createFlight({
  payload: { organizationId, aircraftId, data }
}) {
  try {
    const currentMember = yield call(getCurrentMember)

    const owner = yield call(getMember, organizationId, currentMember.id)
    const pilot = yield call(getMember, organizationId, data.pilot.value)
    const departureAerodrome = yield call(
      getAerodrome,
      data.departureAerodrome.value
    )
    const destinationAerodrome = yield call(
      getAerodrome,
      data.destinationAerodrome.value
    )

    const dataToStore = {
      deleted: false,
      owner: owner.ref,
      member: pilot.ref,
      departureAerodrome: departureAerodrome.ref,
      destinationAerodrome: destinationAerodrome.ref,
      blockOffTime: mergeDateAndTime(data.date, data.blockOffTime),
      takeOffTime: mergeDateAndTime(data.date, data.takeOffTime),
      landingTime: mergeDateAndTime(data.date, data.landingTime),
      blockOnTime: mergeDateAndTime(data.date, data.blockOnTime)
    }

    yield call(
      addDoc,
      ['organizations', organizationId, 'aircrafts', aircraftId, 'flights'],
      dataToStore
    )

    yield put(actions.fetchFlights(organizationId, aircraftId))
    yield put(actions.createFlightSuccess())
  } catch (e) {
    error(`Failed to create flight`, e)
    yield put(actions.createFlightFailure())
  }
}

export function* initCreateFlightDialog() {
  const currentMember = yield call(getCurrentMember)
  yield put(
    actions.updateCreateFlightDialogData({
      initialized: true,
      date: moment().format('YYYY-MM-DD'),
      pilot: getMemberOption(currentMember)
    })
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
  yield put(actions.fetchFlights(organizationId, aircraftId))
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
