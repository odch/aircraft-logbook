const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getMemberByUid = require('../utils/getMemberByUid')
const requireRole = require('../utils/requireRole')
const getOrganizationLimits = require('../utils/getOrganizationLimits')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()

const validateAircraft = aircraft => {
  if (!aircraft) {
    throw new Error('Aircraft data is missing')
  }
  if (!aircraft.registration) {
    throw new Error('Aircraft registration is missing')
  }
  if (!/^[A-Z0-9-]+$/.test(aircraft.registration)) {
    throw new Error(
      `Aircraft registration "${aircraft.registartion}" is invalid`
    )
  }
}

const aircraftExists = async (db, organizationId, registration) => {
  const existingAircraft = await db
    .collection('organizations')
    .doc(organizationId)
    .collection('aircrafts')
    .where('deleted', '==', false)
    .where('registration', '==', registration)
    .limit(1)
    .get()
  return existingAircraft.size === 1
}

const isLimitReached = async (db, organizationId) => {
  const limits = await getOrganizationLimits(db, organizationId)

  if (typeof limits.aircrafts !== 'number') {
    return false
  }

  const aircrafts = await db
    .collection('organizations')
    .doc(organizationId)
    .collection('aircrafts')
    .where('deleted', '==', false)
    .get()

  return aircrafts.size >= limits.aircrafts
}

const addAircraft = functions.https.onCall(async (data, context) => {
  const { organizationId, aircraft } = data

  const member = await getMemberByUid(db, data.organizationId, context.auth.uid)
  requireRole(member, ['manager'])

  validateAircraft(aircraft)

  const exists = await aircraftExists(db, organizationId, aircraft.registration)
  if (exists) {
    return {
      error: 'DUPLICATE'
    }
  }

  const limitReached = await isLimitReached(db, organizationId)
  if (limitReached) {
    return {
      error: 'LIMIT_REACHED'
    }
  }

  aircraft.deleted = false

  await db
    .collection('organizations')
    .doc(organizationId)
    .collection('aircrafts')
    .doc()
    .set(aircraft)

  return {
    error: null
  }
})

exports.addAircraft = addAircraft
