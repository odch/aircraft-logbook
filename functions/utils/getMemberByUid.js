const getMemberByUid = async (db, organizationId, uid) => {
  const userReference = db.collection('users').doc(uid)
  const memberQuerySnapshot = await db
    .collection('organizations')
    .doc(organizationId)
    .collection('members')
    .where('user', '==', userReference)
    .get()
  return memberQuerySnapshot.docs[0]
}

module.exports = getMemberByUid
