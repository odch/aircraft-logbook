const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getMemberByUid = require('../utils/getMemberByUid')
const requireRole = require('../utils/requireRole')
const checkNotExpired = require('../utils/checkNotExpired')
const addTechlogEntry = require('./addTechlogEntry')
const validateFlight = require('./validateFlight')
const getCounters = require('./counters')
const getCorrectionCounters = require('./counters').getCorrectionCounters
const mergeDateAndTime = require('./mergeDateAndTime')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()
const bucket = admin.storage().bucket()

const getAerodrome = async (organizationId, aerodromeId) => {
  let aerodrome = await db.collection('aerodromes').doc(aerodromeId).get()
  if (aerodrome.exists !== true) {
    aerodrome = await db
      .collection('organizations')
      .doc(organizationId)
      .collection('aerodromes')
      .doc(aerodromeId)
      .get()
  }
  if (aerodrome.exists !== true) {
    throw new Error(`Aeorodrome not found for id ${aerodromeId}`)
  }
  return aerodrome
}

const getAircraft = async (organizationId, aircraftId) => {
  const aircraft = await db
    .collection('organizations')
    .doc(organizationId)
    .collection('aircrafts')
    .doc(aircraftId)
    .get()
  if (aircraft.exists !== true) {
    throw new Error(
      `Aircraft not found for id ${aircraftId} in org ${organizationId}`
    )
  }
  return aircraft
}

const getMember = async (organizationId, memberId) => {
  const member = await db
    .collection('organizations')
    .doc(organizationId)
    .collection('members')
    .doc(memberId)
    .get()
  if (member.exists !== true) {
    throw new Error(
      `Member not found for id ${memberId} in org ${organizationId}`
    )
  }
  return member
}

const memberObject = memberDocument => ({
  firstname: memberDocument.get('firstname') || null,
  lastname: memberDocument.get('lastname') || null,
  nr: memberDocument.get('nr') || null,
  member: memberDocument.ref,
  id: memberDocument.id
})

const aerodromeObject = aerodromeDocument => ({
  name: aerodromeDocument.get('name') || null,
  identification: aerodromeDocument.get('identification') || null,
  timezone: aerodromeDocument.get('timezone') || null,
  aerodrome: aerodromeDocument.ref,
  id: aerodromeDocument.id
})

const getMemberObject = async (organizationId, memberId) => {
  const memberDoc = await getMember(organizationId, memberId)
  return memberObject(memberDoc)
}

const getAircraftSettings = async (organizationId, aircraftId) => {
  const aircraft = await getAircraft(organizationId, aircraftId)
  return aircraft.get('settings') || {}
}

const saveFlight = functions.https.onCall(
  async ({ organizationId, aircraftId, data, techlogEntryClosed }, context) => {
    await checkNotExpired(db, organizationId)

    const aircraftSettings = await getAircraftSettings(
      organizationId,
      aircraftId
    )

    let validationErrors = await validateFlight.validateSync(
      data,
      aircraftSettings
    )
    if (Object.getOwnPropertyNames(validationErrors).length > 0) {
      return {
        validationErrors
      }
    }

    const member = await getMemberByUid(db, organizationId, context.auth.uid)

    const departureAerodrome = await getAerodrome(
      organizationId,
      data.departureAerodrome.value
    )

    const counters = getCounters(data)

    data = {
      ...data,
      blockOffTime: mergeDateAndTime(
        data.date,
        data.blockOffTime,
        departureAerodrome.get('timezone')
      )
    }

    validationErrors = await validateFlight.validateAsync(
      data,
      organizationId,
      aircraftId,
      db
    )
    if (Object.getOwnPropertyNames(validationErrors).length > 0) {
      return {
        validationErrors
      }
    }

    let destinationAerodrome

    if (data.id) {
      destinationAerodrome = await getAerodrome(
        organizationId,
        data.destinationAerodrome.value
      )

      data = {
        ...data,
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
    }

    const owner = {
      firstname: member.get('firstname'),
      lastname: member.get('lastname'),
      nr: member.get('nr') || null,
      member: member.ref,
      id: member.id
    }

    const pilot = await getMemberObject(organizationId, data.pilot.value, true)
    const instructor =
      data.instructor && data.instructor.value
        ? await getMemberObject(organizationId, data.instructor.value, true)
        : null

    const fuelUplift =
      typeof data.fuelUplift === 'number' ? data.fuelUplift / 100 : null
    const fuelType = data.fuelType ? data.fuelType.value : null

    const oilUplift =
      typeof data.oilUplift === 'number' ? data.oilUplift / 100 : null

    const flight = {
      nature: typeof data.nature === 'string' ? data.nature : data.nature.value,
      pilot,
      instructor,
      departureAerodrome: aerodromeObject(departureAerodrome),
      destinationAerodrome: destinationAerodrome
        ? aerodromeObject(destinationAerodrome)
        : null,
      blockOffTime: data.blockOffTime,
      takeOffTime: data.takeOffTime,
      landingTime: data.landingTime,
      blockOnTime: data.blockOnTime,
      landings: typeof data.landings === 'number' ? data.landings : null,
      personsOnBoard: data.personsOnBoard,
      fuelUplift,
      fuelType,
      fuelUnit: 'litre',
      oilUplift,
      oilUnit: 'litre',
      remarks: data.remarks || null,
      preflightCheck:
        typeof data.preflightCheck === 'boolean' ? data.preflightCheck : null,
      counters
    }

    if (data.troublesObservations) {
      flight.troublesObservations = data.troublesObservations
      flight.techlogEntryDescription = data.techlogEntryDescription
        ? data.techlogEntryDescription.trim()
        : null
      if (aircraftSettings.techlogEnabled === true) {
        flight.techlogEntryStatus = data.techlogEntryStatus
          ? typeof data.techlogEntryStatus === 'string'
            ? data.techlogEntryStatus
            : data.techlogEntryStatus.value
          : null
      }
    }

    const techlogEntry =
      data.troublesObservations === 'troubles' &&
      (!data.id || data.version === 0) &&
      aircraftSettings.techlogEnabled === true
        ? {
            description: data.techlogEntryDescription.trim(),
            initialStatus: data.techlogEntryStatus.value,
            currentStatus: data.techlogEntryStatus.value,
            closed: techlogEntryClosed,
            attachments: data.techlogEntryAttachments || []
          }
        : null

    flight.deleted = false
    flight.owner = owner
    flight.version = data.id ? 1 : 0
    flight.createTimestamp = new Date()

    await db.runTransaction(async transaction => {
      const aircraftRef = db
        .collection('organizations')
        .doc(organizationId)
        .collection('aircrafts')
        .doc(aircraftId)

      const aircraftDoc = await transaction.get(aircraftRef)

      if (aircraftDoc.exists !== true) {
        throw new Error(
          `Aircraft ${aircraftId} in organization ${organizationId} does not exist`
        )
      }

      const lockDate = aircraftDoc.get('settings.lockDate')
      if (
        lockDate &&
        flight.blockOffTime &&
        flight.blockOffTime.getTime() <= lockDate.toDate().getTime()
      ) {
        throw new Error(
          `Block off time must be after lock date ${lockDate.toDate()}`
        )
      }

      const oldFlightId = data.id

      const oldFlightRef = oldFlightId
        ? aircraftRef.collection('flights').doc(oldFlightId)
        : null
      const newFlightRef = aircraftRef.collection('flights').doc()

      const oldFlightDoc = oldFlightId
        ? await transaction.get(oldFlightRef)
        : null

      if (techlogEntry) {
        techlogEntry.flight = newFlightRef.id
        await addTechlogEntry(
          organizationId,
          aircraftId,
          techlogEntry,
          member,
          aircraftRef,
          bucket,
          transaction
        )
      }

      if (oldFlightDoc && oldFlightDoc.exists === true) {
        if (oldFlightDoc.get('deleted') !== false) {
          throw new Error(
            `Flight ${oldFlightId} of ${aircraftId} in organization ${organizationId} can not be replaced`
          )
        }

        const oldFlightVersion = oldFlightDoc.get('version')

        const oldFlightUpdateData = {
          deleted: true,
          replacedWith: newFlightRef.id,
          deletedBy: owner,
          deleteTimestamp: new Date()
        }

        if (oldFlightVersion === 0) {
          oldFlightUpdateData.blockOffTime = flight.blockOffTime // ensure correct order if archived flights are shown
        }

        transaction.update(oldFlightDoc.ref, oldFlightUpdateData)

        flight.replaces = oldFlightRef.id
        flight.version = oldFlightVersion + 1
      }

      await transaction.set(newFlightRef, flight)
    })

    return {
      techlogEntryAdded: !!techlogEntry
    }
  }
)

const saveCorrectionFlight = functions.https.onCall(
  async ({ organizationId, aircraftId, data }, context) => {
    const member = await getMemberByUid(db, organizationId, context.auth.uid)
    requireRole(member, ['techlogmanager'])

    const aircraftSettings = await getAircraftSettings(
      organizationId,
      aircraftId
    )

    let validationErrors = await validateFlight.validateCorrectionSync(
      data,
      aircraftSettings
    )
    if (Object.getOwnPropertyNames(validationErrors).length > 0) {
      return {
        validationErrors
      }
    }

    const aerodrome = await getAerodrome(organizationId, data.aerodrome.value)
    const newAerodrome = data.newAerodrome
      ? await getAerodrome(organizationId, data.newAerodrome.value)
      : null

    data = {
      ...data,
      time: mergeDateAndTime(
        data.date,
        data.time,
        (newAerodrome || aerodrome).get('timezone')
      )
    }

    validationErrors = await validateFlight.validateCorrectionAsync(
      data,
      organizationId,
      aircraftId,
      db
    )
    if (Object.getOwnPropertyNames(validationErrors).length > 0) {
      return {
        validationErrors
      }
    }

    const owner = {
      firstname: member.get('firstname'),
      lastname: member.get('lastname'),
      nr: member.get('nr') || null,
      member: member.ref,
      id: member.id
    }

    const pilot = await getMemberObject(organizationId, data.pilot.value, true)

    const flight = {
      deleted: false,
      correction: true,
      version: 1,
      createTimestamp: new Date(),
      owner,
      pilot,
      departureAerodrome: aerodromeObject(aerodrome),
      destinationAerodrome: aerodromeObject(newAerodrome || aerodrome),
      blockOffTime: data.time,
      takeOffTime: data.time,
      landingTime: data.time,
      blockOnTime: data.time,
      remarks: data.remarks,
      counters: getCorrectionCounters(data.counters)
    }

    db.collection('organizations')
      .doc(organizationId)
      .collection('aircrafts')
      .doc(aircraftId)
      .collection('flights')
      .doc()
      .set(flight)
  }
)

exports.saveFlight = saveFlight
exports.saveCorrectionFlight = saveCorrectionFlight
