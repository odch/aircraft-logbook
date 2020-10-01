/* eslint-disable no-console */

/*
 * Use this script to import the members of an organization:
 * 1. Create the file members.csv in the current directory
 * 2. Add the serviceAccountKey.json file in the current directory (download from Firebase console)
 * 3. Set the variables `organizationName` and `databaseURL`
 * 4. Run the script: `node organizationMembersImport`
 *
 * Form of the file members.csv (nr, lastname, firstname, invite email, instructor):
 *
 * 11069,Keller,Stefan,stefankeller@test.com,true
 * 11291,Mustermann,Erwin,,false
 * 11752,Musterfrau,Gundula,,true
 * ...
 */

const fs = require('fs')
const csv = require('fast-csv')
const admin = require('firebase-admin')
const util = require('util')

const serviceAccount = require('./serviceAccountKey.json')

const organizationName = 'mfgt'
const databaseURL = 'https://odch-aircraft-logbook-dev.firebaseio.com'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL
})

const firestore = admin.firestore()

fs.createReadStream('./members.csv')
  .pipe(csv.parse())
  .on('data', async function (data) {
    const member = {
      nr: data[0],
      lastname: data[1],
      firstname: data[2],
      inviteEmail: data[3],
      instructor: data[4] === 'true'
    }
    await addOrUpdateMember(member)
  })
  .on('end', function () {
    console.log('done')
  })

async function addOrUpdateMember(member) {
  const existingMember = await getByFieldValue(
    `organizations/${organizationName}/members`,
    'nr',
    member.nr
  )
  if (!existingMember) {
    const data = {
      ...member,
      deleted: false
    }
    return firestore
      .collection(`organizations/${organizationName}/members`)
      .add(data)
  } else if (!existingMember.get('user')) {
    return existingMember.ref.update({
      inviteEmail: member.inviteEmail,
      instructor: member.instructor
    })
  }
}

async function getByFieldValue(collection, fieldName, value) {
  return await firestore
    .collection(collection)
    .where(fieldName, '==', value)
    .get()
    .then(getSingleSnapshot)
}

function getSingleSnapshot(snapshot) {
  if (snapshot.size === 0) {
    return null
  } else if (snapshot.size === 1) {
    return snapshot.docs[0]
  } else {
    throw `More than 1 snapshot found. First: ${util.inspect(snapshot.docs[0])}`
  }
}
