const getOrganization = async (firstore, organizationId) =>
  firstore
    .collection('organizations')
    .doc(organizationId)
    .get()

const hasMember = async (firestore, organization, user, requiredRole) => {
  const userRef = firestore.collection('users').doc(user.uid)

  const memberQuery = organization.ref
    .collection('members')
    .where('user', '==', userRef)

  if (requiredRole) {
    memberQuery.where('roles', 'array-contains', requiredRole)
  }

  const memberQuerySnapshot = await memberQuery.get()

  return memberQuerySnapshot.empty === false
}

module.exports = {
  getOrganization,
  hasMember
}
