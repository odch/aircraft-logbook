const yaml = require('js-yaml')
const fs = require('fs')
const admin = require('firebase-admin')
const moment = require('moment')

const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://odch-aircraft-logbook-dev.firebaseio.com'
})

const firestore = admin.firestore()

const aerodromes = yaml.safeLoad(fs.readFileSync('data/aerodromes.yml', 'utf8'))
const users = yaml.safeLoad(fs.readFileSync('data/users.yml', 'utf8'))
const organizations = yaml.safeLoad(
  fs.readFileSync('data/organizations.yml', 'utf8')
)

aerodromes.forEach(aerodrome => addAerodrome(aerodrome))
users.forEach(user => addUser(user))

Object.keys(organizations).forEach(organizationId =>
  addOrganization(organizationId, organizations[organizationId])
)

async function addAerodrome(aerodrome) {
  const existingAerodrome = await getByFieldValue(
    'aerodromes',
    'identification',
    aerodrome.identification
  )
  if (!existingAerodrome) {
    return firestore.collection('aerodromes').add(aerodrome)
  }
}

async function addUser(user) {
  const existingUser = await getByFieldValue('users', 'email', user.email)
  if (!existingUser) {
    return firestore.collection('users').add(user)
  }
}

async function addOrganization(id, organization) {
  const owner = await await getByFieldValue(
    'users',
    'email',
    organization.owner
  )
  if (!owner) {
    throw `User with email ${organization.owner} not found`
  }
  const data = {
    owner: owner.ref
  }
  await firestore
    .collection('organizations')
    .doc(id)
    .set(data)
  if (organization.members) {
    addMembers(id, organization.members)
  }
  if (organization.aircrafts) {
    addAircrafts(id, organization.aircrafts)
  }
}

async function addMembers(organizationId, members) {
  members.forEach(member => addMember(organizationId, member))
}

async function addAircrafts(organizationId, aircrafts) {
  aircrafts.forEach(aircraft => addAircraft(organizationId, aircraft))
}

async function addMember(organizationId, member) {
  const collection = `organizations/${organizationId}/members`
  const existingMember = await getByFieldValue(
    collection,
    'inviteEmail',
    member.inviteEmail
  )
  if (!existingMember) {
    const user = await getByFieldValue('users', 'email', member.inviteEmail)
    if (!user) {
      throw `User with email ${member.inviteEmail} not found`
    }
    await firestore.collection(collection).add({
      ...member,
      user: user.ref
    })
  }
}

async function addAircraft(organizationId, aircraft) {
  const collection = `organizations/${organizationId}/aircrafts`
  let aircraftDoc = await getByFieldValue(
    collection,
    'registration',
    aircraft.registration
  )
  if (!aircraftDoc) {
    const { registration, mtow } = aircraft
    aircraftDoc = await firestore.collection(collection).add({
      registration,
      mtow
    })
  }
  if (aircraft.flights) {
    addFlights(organizationId, aircraftDoc, aircraft.flights)
  }
}

async function addFlights(organizationId, aircraftDoc, flights) {
  flights.forEach(flight => addFlight(organizationId, aircraftDoc, flight))
}

async function addFlight(organizationId, aircraftDoc, flight) {
  const {
    owner,
    departureAerodrome,
    destinationAerodrome,
    blockOffTime,
    takeOffTime,
    landingTime,
    blockOnTime
  } = flight

  const member = await requireByFieldValue(
    `organizations/${organizationId}/members`,
    'inviteEmail',
    owner
  )
  const departureAerodromeDoc = await requireByFieldValue(
    'aerodromes',
    'identification',
    departureAerodrome
  )
  const destinationAerodromeDoc = await requireByFieldValue(
    'aerodromes',
    'identification',
    destinationAerodrome
  )
  const blockOffDate = moment(blockOffTime).toDate()
  const takeOffDate = moment(takeOffTime).toDate()
  const landingDate = moment(landingTime).toDate()
  const blockOnDate = moment(blockOnTime).toDate()

  let flightDoc = await aircraftDoc.ref
    .collection('flights')
    .where('blockOffTime', '==', blockOffDate)
    .get()
    .then(getSingleSnapshot)

  if (!flightDoc) {
    flightDoc = await aircraftDoc.ref.collection('flights').add({
      owner: member.ref,
      deleted: false,
      blockOffTime: blockOffDate,
      takeOffTime: takeOffDate,
      landingTime: landingDate,
      blockOnTime: blockOnDate,
      member: member.ref,
      departureAerodrome: departureAerodromeDoc.ref,
      destinationAerodrome: destinationAerodromeDoc.ref
    })
  }

  return flightDoc
}

async function requireByFieldValue(collection, fieldName, value) {
  const doc = getByFieldValue(collection, fieldName, value)
  if (!doc) {
    throw `Doc not found`
  }
  return doc
}

async function getByFieldValue(collection, fieldName, value) {
  return await firestore
    .collection(collection)
    .where(fieldName, '==', value)
    .get()
    .then(getSingleSnapshot)
}

function getSingleSnapshot(snapshot) {
  if (snapshot.size === 0) {
    return null
  } else if (snapshot.size === 1) {
    return snapshot.docs[0]
  } else {
    throw `More than 1 snapshot found`
  }
}
