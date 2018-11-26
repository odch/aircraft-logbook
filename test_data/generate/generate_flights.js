const yaml = require('js-yaml')
const fs = require('fs')
const moment = require('moment')

const organizationId = process.argv[2]
const aircraftRegistration = process.argv[3]
const startDate = moment(process.argv[4])
const count = parseInt(process.argv[5])

console.log(`Generating flights:
Organzation: ${organizationId}
Aircraft: ${aircraftRegistration}
Start date: ${startDate}
Count: ${count}
`)

const aerodromes = yaml.safeLoad(
  fs.readFileSync('../data/aerodromes.yml', 'utf8')
)
const organizations = yaml.safeLoad(
  fs.readFileSync('../data/organizations.yml', 'utf8')
)

const organization = organizations[organizationId]

if (!organization) {
  throw `Organization not found`
}

const aircraft = organization.aircrafts.find(
  aircraft => aircraft.registration === aircraftRegistration
)

if (!aircraft) {
  throw `Aircraft not found`
}

const members = organization.members.map(member => member.inviteEmail)

const flights = aircraft.flights || []

for (let i = 0; i < count; i++) {
  const flight = {
    owner: pickRandom(members),
    departureAerodrome: pickRandom(aerodromes).identification,
    destinationAerodrome: pickRandom(aerodromes).identification,
    blockOffTime: startDate
      .clone()
      .add({ days: i, hours: 10, minutes: 0 })
      .toISOString(true),
    takeOffTime: startDate
      .clone()
      .add({ days: i, hours: 10, minutes: 10 })
      .toISOString(true),
    landingTime: startDate
      .clone()
      .add({ days: i, hours: 11, minutes: 0 })
      .toISOString(true),
    blockOnTime: startDate
      .clone()
      .add({ days: i, hours: 11, minutes: 10 })
      .toISOString(true)
  }
  flights.push(flight)
}

fs.writeFileSync('../data/organizations.yml', yaml.safeDump(organizations), {
  encoding: 'utf8'
})

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
