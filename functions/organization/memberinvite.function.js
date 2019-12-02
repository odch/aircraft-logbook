/* eslint-disable no-empty */
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const nodemailer = require('nodemailer')

const config = functions.config()

if (!config.invite || !config.invite.sender || !config.invite.sender.host) {
  throw new Error(
    'Required configuration property `invite.sender.host` not defined'
  )
}
if (!config.invite.sender.port) {
  throw new Error(
    'Required configuration property `invite.sender.port` not defined'
  )
}
if (!config.invite.sender.email) {
  throw new Error(
    'Required configuration property `invite.sender.email` not defined'
  )
}
if (!config.invite.sender.user) {
  throw new Error(
    'Required configuration property `invite.sender.user` not defined'
  )
}
if (!config.invite.sender.password) {
  throw new Error(
    'Required configuration property `invite.sender.password` not defined'
  )
}
if (!config.invite.url) {
  throw new Error('Required configuration property `invite.url` not defined')
}

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {}

const transporter = nodemailer.createTransport({
  host: config.invite.sender.host,
  port: config.invite.sender.port,
  secure: true,
  auth: {
    user: config.invite.sender.user,
    pass: config.invite.sender.password
  }
})

const sendMail = (inviteEmail, firstname, orgId, memberId) => {
  console.log(
    `sending invitation mail (to: ${inviteEmail}, firstname: ${firstname}, org id: ${orgId}, member id: ${memberId})`
  )

  const link = `${config.invite.url}/organizations/${orgId}/invite/${memberId}`

  const html = `<h1>Hallo ${firstname}!</h1>
     <p>Du wurdest eingeladen, der Organisation <strong>${orgId}</strong> beizutreten.</p>
     <p><a href="${link}">Klicke hier</a>, um die Einladung anzunehmen.</p>`

  const mailOptions = {
    from: config.invite.sender.email,
    to: inviteEmail,
    subject: `Digitales Flugreisebuch: Einladung in Organisation ${orgId}`,
    html
  }

  return transporter.sendMail(mailOptions)
}

const setTimestamp = memberRef =>
  memberRef.set(
    {
      inviteTimestamp: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  )

const sendInvitation = change => {
  const data = change.after.data()

  if (data && data['inviteEmail'] && !data['inviteTimestamp']) {
    const email = data['inviteEmail']
    const firstname = data['firstname']
    const orgId = change.after.ref.parent.parent.id
    const memberId = change.after.ref.id

    return sendMail(email, firstname, orgId, memberId).then(() =>
      setTimestamp(change.after.ref)
    )
  }

  return null
}

module.exports.sendInvitationOnMemberWrite = functions.firestore
  .document('organizations/{organizationID}/members/{memberID}')
  .onWrite(change => sendInvitation(change))
