const getAircraft = async (db, organizationId, aircraftId) => {
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
      `Aircraft does not exist (org id: ${organizationId}, aircraft id: ${aircraftId})`
    )
  }

  return aircraft
}

module.exports = getAircraft
