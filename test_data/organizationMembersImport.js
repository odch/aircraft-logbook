/* eslint-disable no-console */

/*
 * Use this script to import the members of an organization:
 * 1. Create the file members.csv in the current directory
 * 2. Add the serviceAccountKey.json file in the current directory (download from Firebase console)
 * 3. Set the variables `organizationName` and `databaseURL`
 * 4. Run the script: `node organizationMembersImport`
 *
 * Form of the file members.csv:
 *
 * 11069,Keller,Stefan
 * 11291,Mustermann,Erwin
 * 11752,Musterfrau,Gundula
 * ...
 */

const fs = require('fs')
const csv = require('fast-csv')
const admin = require('firebase-admin')

const serviceAccount = require('./serviceAccountKey.json')

const organizationName = 'mfgt'
const databaseURL = 'https://odch-aircraft-logbook-dev.firebaseio.com'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL
})

const firestore = admin.firestore()

fs.createReadStream('./members.csv')
  .pipe(csv())
  .on('data', function(data) {
    const member = {
      nr: data[0],
      lastname: data[1],
      firstname: data[2],
      deleted: false
    }
    addMember(member)
  })
  .on('end', function() {
    console.log('done')
  })

async function addMember(member) {
  const existingMember = await getByFieldValue(
    `organizations/${organizationName}/members`,
    'nr',
    member.nr
  )
  if (!existingMember) {
    return firestore
      .collection(`organizations/${organizationName}/members`)
      .add(member)
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
    throw `More than 1 snapshot found`
  }
}
