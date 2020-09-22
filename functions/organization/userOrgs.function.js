/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

const db = admin.firestore()

const updateUserOrg = async (userRef, orgRef) => {
  if (!userRef) {
    return
  }
  const userDoc = await userRef.get()
  if (userDoc.exists !== true) {
    return
  }

  const orgDoc = await orgRef.get()
  if (orgDoc.exists !== true || orgDoc.get('deleted')) {
    await userRef.update({
      [`orgs.${orgRef.id}`]: admin.firestore.FieldValue.delete()
    })
    return
  }

  const members = await orgRef
    .collection('members')
    .where('deleted', '==', false)
    .where('user', '==', userRef)
    .get()

  if (members.empty === true) {
    await userRef.update({
      [`orgs.${orgRef.id}`]: admin.firestore.FieldValue.delete()
    })
  } else {
    const roleSet = members.docs.reduce((set, member) => {
      const memberRoles = member.get('roles') || []
      memberRoles.forEach(set.add, set)
      return set
    }, new Set())
    const roleArray = Array.from(roleSet)
    await userRef.update({
      [`orgs.${orgRef.id}`]: {
        ref: orgRef,
        roles: roleArray
      }
    })
  }
}

const updateUserOrgs = async userRef => {
  const orgs = await db
    .collection('organizations')
    .where('deleted', '==', false)
    .get()
  await Promise.all(orgs.docs.map(org => updateUserOrg(userRef, org.ref)))
}

const updateOrgUsers = async orgRef => {
  const users = await db
    .collection('users')
    .where(`orgs.${orgRef.id}.ref`, '==', orgRef)
    .get()
  await Promise.all(users.docs.map(user => updateUserOrg(user.ref, orgRef)))
}

const markedAsDeleted = change =>
  change.before.get('deleted') === false && change.after.get('deleted') === true

const hasUser = change => !!change.before.get('user')

const changedRoles = change => {
  const rolesBefore = change.before.get('roles') || []
  const rolesAfter = change.after.get('roles') || []
  return !eqSet(new Set(rolesBefore), new Set(rolesAfter))
}

const eqSet = (set1, set2) => {
  if (set1.size !== set2.size) return false
  for (const item of set1) if (!set2.has(item)) return false
  return true
}

const updateUserOrgsOnMemberUpdate = async change => {
  if (hasUser(change) && (markedAsDeleted(change) || changedRoles(change))) {
    const orgRef = change.before.ref.parent.parent
    const userRefBefore = change.before.get('user')
    await updateUserOrg(userRefBefore, orgRef)
  }
}

const updateUserOrgsOnMemberDelete = async memberDoc => {
  const data = memberDoc.data()
  if (data.user) {
    const user = await data.user.get()
    if (user.exists === true) {
      const orgRef = memberDoc.ref.parent.parent
      await updateUserOrg(data.user, orgRef)
    }
  }
}

const updateUserOrgsOnOrgUpdate = async change => {
  if (markedAsDeleted(change)) {
    await updateOrgUsers(change.before.ref)
  }
}

const updateUserOrgsOnOrgDelete = async orgDoc => {
  await updateOrgUsers(orgDoc.ref)
}

const updateUserOrgsOnLogin = async change => {
  const lastLoginBefore = change.before.get('lastLogin')
  const lastLoginAfter = change.after.get('lastLogin')
  const orgsAfter = change.after.get('orgs')
  if (!lastLoginAfter.isEqual(lastLoginBefore) && !orgsAfter) {
    await updateUserOrgs(change.after.ref)
  }
}

module.exports.updateUserOrgsOnMemberUpdate = functions.firestore
  .document('organizations/{organizationID}/members/{memberID}')
  .onUpdate(change => updateUserOrgsOnMemberUpdate(change))

module.exports.updateUserOrgsOnMemberDelete = functions.firestore
  .document('organizations/{organizationID}/members/{memberID}')
  .onDelete(memberDoc => updateUserOrgsOnMemberDelete(memberDoc))

module.exports.updateUserOrgsOnLogin = functions.firestore
  .document('users/{userID}')
  .onUpdate(change => updateUserOrgsOnLogin(change))

module.exports.updateUserOrgsOnOrgUpdate = functions.firestore
  .document('organizations/{organizationID}')
  .onUpdate(change => updateUserOrgsOnOrgUpdate(change))

module.exports.updateUserOrgsOnOrgDelete = functions.firestore
  .document('organizations/{organizationID}')
  .onDelete(orgDoc => updateUserOrgsOnOrgDelete(orgDoc))
