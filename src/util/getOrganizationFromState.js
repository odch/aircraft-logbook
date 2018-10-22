const getOrganizationFromState = (state, organizationId) => {
  const organizations = state.firestore.data.organizations
  if (organizations) {
    const organization = organizations[organizationId]
    if (organization) {
      return { ...organization, id: organizationId }
    }
    return null // not found
  }
  return undefined // still loading
}

export default getOrganizationFromState
