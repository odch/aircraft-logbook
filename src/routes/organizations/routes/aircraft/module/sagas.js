import { fork, takeEvery, all, call } from 'redux-saga/effects'
import { getFirestore } from '../../../../../util/firebase'
import * as actions from './actions'

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
      orderBy: ['blockOffTime', 'desc'],
      limit: 5,
      storeAs: 'flights-' + aircraftId,
      populate: ['departureAerodrome', 'destinationAerodrome', 'member']
    },
    {}
  )
}

export default function* sagas() {
  yield all([fork(takeEvery, actions.FETCH_FLIGHTS, fetchFlights)])
}
