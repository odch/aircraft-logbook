import { call } from 'redux-saga/effects'
import { getFirestore } from '../../../../../../util/firebase'

export default function* getLastFlight(organizationId, aircraftId) {
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
