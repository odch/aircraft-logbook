/* eslint-disable no-empty */
const functions = require('firebase-functions')
const nodemailer = require('nodemailer')

const config = functions.config()

if (!config.smtp || !config.smtp.host) {
  throw new Error('Required configuration property `smtp.host` not defined')
}
if (!config.smtp.port) {
  throw new Error('Required configuration property `smtp.port` not defined')
}
if (!config.smtp.user) {
  throw new Error('Required configuration property `smtp.user` not defined')
}
if (!config.smtp.password) {
  throw new Error('Required configuration property `smtp.password` not defined')
}
if (!config.smtp.email) {
  throw new Error('Required configuration property `smtp.email` not defined')
}

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: true,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.password
  }
})

const sendMail = (to, subject, html) => {
  const mailOptions = {
    from: config.smtp.email,
    to,
    subject,
    html
  }
  return transporter.sendMail(mailOptions)
}

module.exports = sendMail
