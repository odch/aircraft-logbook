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

const ensureManager = async (organizationId, context) => {
  const member = await getMemberByUid(db, organizationId, context.auth.uid)
  requireRole(member, ['manager'])
}

const VALIDATORS = {
  techlogEnabled: (name, value, limits, organizationId) => {
    if (limits.techlogDisabled === true) {
      return `Techlog feature disabled on organization ${organizationId}`
    }
  }
}

const validate = async (organizationId, name, value) => {
  if (VALIDATORS[name]) {
    const limits = await getOrganizationLimits(db, organizationId)
    const error = VALIDATORS[name](name, value, limits, organizationId)
    if (error) {
      throw new Error(error)
    }
  }
}

const updateAircraftSetting = functions.https.onCall(async (data, context) => {
  const { organizationId, aircraftId, name, value } = data

  await ensureManager(organizationId, context)
  await validate(organizationId, name, value)

  const aircraft = await db
    .collection('organizations')
    .doc(organizationId)
    .collection('aircrafts')
    .doc(aircraftId)
    .get()

  if (
    !aircraft ||
    aircraft.exists !== true ||
    aircraft.get('deleted') === true
  ) {
    throw new Error(
      `Cannot update setting of aircraft that does not exist (org id: ${organizationId}, aircraft id: ${aircraftId})`
    )
  }

  await aircraft.ref.update({
    [`settings.${name}`]: value
  })
})

exports.updateAircraftSetting = updateAircraftSetting
