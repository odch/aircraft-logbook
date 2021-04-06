const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getMemberByUid = require('../utils/getMemberByUid')
const requireRole = require('../utils/requireRole')
const getOrganizationLimits = require('../utils/getOrganizationLimits')
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

  const aircraft = await getAircraft(db, organizationId, aircraftId)

  await aircraft.ref.update({
    [`settings.${name}`]: value
  })
})

exports.updateAircraftSetting = updateAircraftSetting
