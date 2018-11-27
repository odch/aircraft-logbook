const getOrganizationFromState = (state, organizationId) => {
  const organizations = state.main.app.organizations
  if (organizations) {
    const organization = organizations.find(org => org.id === organizationId)
    if (organization) {
      return { ...organization, id: organizationId }
    }
    return null // not found
  }
  return undefined // still loading
}

export default getOrganizationFromState
