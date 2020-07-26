const functions = require('firebase-functions')
const admin = require('firebase-admin')
const uuid = require('uuid')
const stream = require('stream')
const getMemberByUid = require('../utils/getMemberByUid')

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

const db = admin.firestore()
const bucket = admin.storage().bucket()

const writeFile = (attachment, file) =>
  new Promise((resolve, reject) => {
    const { name, base64, contentType } = attachment

    const bufferStream = new stream.PassThrough()
    bufferStream.end(Buffer.from(base64, 'base64'))

    bufferStream
      .pipe(
        file.createWriteStream({
          metadata: {
            contentType,
            metadata: {
              originalName: name
            }
          }
        })
      )
      .on('error', e => reject(e))
      .on('finish', () => resolve())
  })

const addAttachment = async (
  organizationId,
  aircraftId,
  techlogEntryId,
  attachment
) => {
  const id = uuid.v4()
  const extension = attachment.name.split('.').pop()
  const name = id + '.' + extension
  const path = `organizations/${organizationId}/aircrafts/${aircraftId}/techlog/${techlogEntryId}/${name}`

  const file = bucket.file(path)
  await writeFile(attachment, file)

  const [metadata] = await file.getMetadata()

  return {
    file,
    name,
    metadata,
    originalName: attachment.name
  }
}

const addAttachments = async (
  organizationId,
  aircraftId,
  techlogEntryId,
  attachments
) =>
  await Promise.all(
    attachments.map(
      async attachment =>
        await addAttachment(
          organizationId,
          aircraftId,
          techlogEntryId,
          attachment
        )
    )
  )

const addTechlogEntry = functions.https.onCall(async (data, context) => {
  const { organizationId, aircraftId, entry } = data

  const member = await getMemberByUid(db, organizationId, context.auth.uid)

  entry.timestamp = new Date()
  entry.deleted = false
  entry.author = {
    firstname: member.get('firstname'),
    lastname: member.get('lastname'),
    nr: member.get('nr') || null,
    member: member.ref,
    id: member.id
  }

  const batch = db.batch()

  const aircraftRef = db
    .collection('organizations')
    .doc(organizationId)
    .collection('aircrafts')
    .doc(aircraftId)

  const newEntryRef = aircraftRef.collection('techlog').doc()

  if (entry.attachments) {
    const results = await addAttachments(
      organizationId,
      aircraftId,
      newEntryRef.id,
      entry.attachments
    )
    entry.attachments = results.map(result => ({
      name: result.name,
      originalName: result.originalName,
      size: parseInt(result.metadata.size),
      contentType: result.metadata.contentType,
      path: result.metadata.name
    }))
  }

  batch.set(newEntryRef, entry)

  batch.update(aircraftRef, {
    'counters.techlogEntries': admin.firestore.FieldValue.increment(1)
  })

  await batch.commit()
})

exports.addTechlogEntry = addTechlogEntry
