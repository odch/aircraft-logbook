/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

const db = admin.firestore()

/**
 * @returns {Promise<boolean>} promise that resolves to true if the user is a member of the org
 */
const updateUserOrg = async (userDoc, orgRef) => {
  if (userDoc.exists !== true) {
    throw new Error(`User doc ${userDoc.ref.id} does not exist`)
  }

  const orgDoc = await orgRef.get()
  if (orgDoc.exists !== true || orgDoc.get('deleted')) {
    await userDoc.ref.update({
      [`orgs.${orgRef.id}`]: admin.firestore.FieldValue.delete()
    })
    return false
  }

  const members = await orgRef
    .collection('members')
    .where('deleted', '==', false)
    .where('user', '==', userDoc.ref)
    .get()

  if (members.empty === true) {
    await userDoc.ref.update({
      [`orgs.${orgRef.id}`]: admin.firestore.FieldValue.delete()
    })
    return false
  } else {
    const roleSet = members.docs.reduce((set, member) => {
      const memberRoles = member.get('roles') || []
      memberRoles.forEach(set.add, set)
      return set
    }, new Set())
    const roleArray = Array.from(roleSet)
    await userDoc.ref.update({
      [`orgs.${orgRef.id}`]: {
        ref: orgRef,
        roles: roleArray
      }
    })
    return true
  }
}

const updateUserOrgs = async userDoc => {
  const orgs = await db
    .collection('organizations')
    .where('deleted', '==', false)
    .get()
  const results = await Promise.all(
    orgs.docs.map(org => updateUserOrg(userDoc, org.ref))
  )
  const hasOrgs = results.some(result => result === true)
  if (!hasOrgs) {
    await userDoc.ref.update({
      orgs: {}
    })
  }
}

const updateOrgUsers = async orgRef => {
  const users = await db
    .collection('users')
    .where(`orgs.${orgRef.id}.ref`, '==', orgRef)
    .get()
  await Promise.all(users.docs.map(userDoc => updateUserOrg(userDoc, orgRef)))
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
    const userDoc = await userRefBefore.get()
    if (userDoc.exists === true) {
      await updateUserOrg(userDoc, orgRef)
    }
  }
}

const updateUserOrgsOnMemberDelete = async memberDoc => {
  const data = memberDoc.data()
  if (data.user) {
    const userDoc = await data.user.get()
    if (userDoc.exists === true) {
      const orgRef = memberDoc.ref.parent.parent
      await updateUserOrg(userDoc, orgRef)
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
  if (change.after.exists === true) {
    const lastLoginBefore = change.before.get('lastLogin')
    const lastLoginAfter = change.after.get('lastLogin')
    const orgsAfter = change.after.get('orgs')
    if (!lastLoginAfter.isEqual(lastLoginBefore) && !orgsAfter) {
      await updateUserOrgs(change.after)
    }
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
  .onWrite(change => updateUserOrgsOnLogin(change))

module.exports.updateUserOrgsOnOrgUpdate = functions.firestore
  .document('organizations/{organizationID}')
  .onUpdate(change => updateUserOrgsOnOrgUpdate(change))

module.exports.updateUserOrgsOnOrgDelete = functions.firestore
  .document('organizations/{organizationID}')
  .onDelete(orgDoc => updateUserOrgsOnOrgDelete(orgDoc))
