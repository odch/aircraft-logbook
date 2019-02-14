/* eslint-disable no-console */
// get the CSV file to import at https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat

const fs = require('fs')
const csv = require('fast-csv')
const admin = require('firebase-admin')

const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://odch-aircraft-logbook-dev.firebaseio.com'
})

const firestore = admin.firestore()

fs.createReadStream('./data/airports_openflights.csv')
  .pipe(csv())
  .on('data', function(data) {
    const aerodrome = {
      name: data[1],
      identification: data[5],
      timezone: data[11]
    }
    if (
      aerodrome.name &&
      aerodrome.identification &&
      aerodrome.timezone &&
      aerodrome.timezone.startsWith('Europe')
    ) {
      addAerodrome(aerodrome)
    }
  })
  .on('end', function() {
    console.log('done')
  })

async function addAerodrome(aerodrome) {
  const existingAerodrome = await getByFieldValue(
    'aerodromes',
    'identification',
    aerodrome.identification
  )
  if (!existingAerodrome) {
    return firestore.collection('aerodromes').add(aerodrome)
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
