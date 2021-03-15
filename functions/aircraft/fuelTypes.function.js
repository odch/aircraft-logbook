const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getMemberByUid = require('../utils/getMemberByUid')
const requireRole = require('../utils/requireRole')
const getAircraft = require('../utils/getAircraft')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()

const ensureManager = async (organizationId, context) => {
  const member = await getMemberByUid(db, organizationId, context.auth.uid)
  requireRole(member, ['manager'])
}

const doWithFuelType = async (data, context, arrayFn) => {
  const { organizationId, aircraftId, fuelType } = data

  await ensureManager(organizationId, context)

  const aircraft = await getAircraft(db, organizationId, aircraftId)

  await aircraft.ref.update({
    'settings.fuelTypes': arrayFn(fuelType)
  })
}

const addFuelType = functions.https.onCall(async (data, context) =>
  doWithFuelType(data, context, admin.firestore.FieldValue.arrayUnion)
)

const deleteFuelType = functions.https.onCall(async (data, context) =>
  doWithFuelType(data, context, admin.firestore.FieldValue.arrayRemove)
)

exports.addFuelType = addFuelType
exports.deleteFuelType = deleteFuelType
