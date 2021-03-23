const moment = require('moment-timezone')

const isBefore = (dateTime, comparisonDateTime) =>
  moment(dateTime).isBefore(moment(comparisonDateTime))

const checkNotExpired = async (db, organizationId) => {
  const org = await db.collection('organizations').doc(organizationId).get()

  if (!org || org.exists !== true || org.get('deleted') === true) {
    throw new Error(`Organization does not exist (org id: ${organizationId})`)
  }

  const expiration = org.get('limits.expiration')

  if (expiration && isBefore(expiration.toDate(), new Date())) {
    throw new Error(
      `Organization ${organizationId} has expired on ${expiration.toDate()}`
    )
  }
}

module.exports = checkNotExpired
