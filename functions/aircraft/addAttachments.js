const uuid = require('uuid')
const stream = require('stream')

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

const getPath = (organizationId, aircraftId, techlogEntryId, actionId, name) =>
  `organizations/${organizationId}/aircrafts/${aircraftId}/techlog/${techlogEntryId}/${
    actionId ? `${actionId}/` : ''
  }${name}`

const addAttachment = async (
  bucket,
  organizationId,
  aircraftId,
  techlogEntryId,
  actionId,
  attachment
) => {
  const id = uuid.v4()
  const extension = attachment.name.split('.').pop()
  const name = id + '.' + extension
  const path = getPath(
    organizationId,
    aircraftId,
    techlogEntryId,
    actionId,
    name
  )

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
  bucket,
  organizationId,
  aircraftId,
  techlogEntryId,
  actionId,
  attachments
) => {
  if (!attachments || attachments.length === 0) {
    return []
  }
  const results = await Promise.all(
    attachments.map(
      async attachment =>
        await addAttachment(
          bucket,
          organizationId,
          aircraftId,
          techlogEntryId,
          actionId,
          attachment
        )
    )
  )
  return results.map(result => ({
    name: result.name,
    originalName: result.originalName,
    size: parseInt(result.metadata.size),
    contentType: result.metadata.contentType,
    path: result.metadata.name
  }))
}

module.exports = addAttachments
