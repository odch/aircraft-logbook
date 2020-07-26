const os = require('os')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const organizationUtil = require('./utils/organization')

const checkPermissions = async (firestore, organizationId, user) => {
  const organization = await organizationUtil.getOrganization(
    firestore,
    organizationId
  )
  const hasMember = await organizationUtil.hasMember(
    firestore,
    organization,
    user
  )
  if (hasMember !== true) {
    throw new Error('User ' + user.uid + ' not authorized')
  }
}

const getAttachment = async (bucket, args) => {
  const { organization, aircraft, techlogEntry, name } = args
  const filePath = `organizations/${organization}/aircrafts/${aircraft}/techlog/${techlogEntry}/${name}`
  const file = bucket.file(filePath)

  const [metadata] = await file.getMetadata()

  const tempFilePath = path.join(os.tmpdir(), uuid.v4())
  await file.download({
    destination: tempFilePath
  })
  const data = fs.readFileSync(tempFilePath)
  fs.unlinkSync(tempFilePath)

  return {
    data,
    originalName: metadata.metadata.originalName,
    contentType: metadata.contentType
  }
}

/**
 * @param args
 *  * organization,
 *  * aircraft,
 *  * techlogEntry,
 *  * name
 */
const getTechlogAttachment = async (firestore, bucket, args, user) => {
  await checkPermissions(firestore, args.organization, user)
  return await getAttachment(bucket, args)
}

module.exports = getTechlogAttachment
