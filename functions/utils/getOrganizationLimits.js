const getOrganizationLimits = async (db, organizationId) => {
  const orgDoc = await db.collection('organizations').doc(organizationId).get()
  if (orgDoc.exists !== true) {
    throw new Error(`Organization with ID ${organizationId} does not exist`)
  }
  return orgDoc.get('limits') || {}
}

module.exports = getOrganizationLimits
