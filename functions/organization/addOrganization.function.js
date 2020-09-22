const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()

// name may only contain alphanumeric characters or hyphens.
// name cannot have multiple consecutive hyphens.
// name cannot begin or end with a hyphen.
//mMinimum is 4, maximum is 39 characters.
const NAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){3,38}$/

const addOrganization = functions.https.onCall(async (data, context) => {
  const { name } = data

  if (!context.auth || !context.auth.uid) {
    throw new Error('User is not authenticated')
  }

  if (!name || !NAME_REGEX.test(name)) {
    throw new Error(`Invalid organization name ${name}`)
  }

  const dataToStore = {
    name,
    deleted: false
  }

  await db.runTransaction(async t => {
    const userRef = db.collection('users').doc(context.auth.uid)
    const orgRef = db.collection('organizations').doc(name)

    const userDoc = await t.get(userRef)
    const orgDoc = await t.get(orgRef)

    if (!userDoc.exists) {
      throw new Error(`User doc for user ${context.auth.uid} does not exist`)
    }
    if (orgDoc.exists) {
      throw new Error(`Organization ${name} already exists`)
    }

    const firstname = userDoc.get('firstname')
    const lastname = userDoc.get('lastname')

    if (!firstname) {
      throw new Error(
        `Missing property 'firstname' on user doc ${context.auth.uid}`
      )
    }
    if (!lastname) {
      throw new Error(
        `Missing property 'lastname' on user doc ${context.auth.uid}`
      )
    }

    const memberRef = db
      .collection('organizations')
      .doc(name)
      .collection('members')
      .doc()

    await t.set(orgRef, dataToStore)
    await t.set(memberRef, {
      firstname,
      lastname,
      user: userRef,
      deleted: false,
      roles: ['manager']
    })
    await t.update(userRef, {
      [`orgs.${name}`]: {
        ref: orgRef,
        roles: ['manager']
      }
    })
  })
})

exports.addOrganization = addOrganization
