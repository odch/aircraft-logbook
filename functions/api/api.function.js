const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cookieParser = require('cookie-parser')()
const cors = require('cors')({ origin: true, credentials: true })
const csv = require('fast-csv')
const validateFirebaseIdToken = require('./utils/validateFirebaseIdToken')
const collectFlights = require('./collectFlights')
const getTechlogAttachment = require('./getTechlogAttachment')

const api = express()

// Prevent firebase from initializing twice
try {
  admin.initializeApp(functions.config().firebase)
  // eslint-disable-next-line no-empty
} catch (e) {}

api.use(cors)
api.use(cookieParser)
api.use(validateFirebaseIdToken(admin))

const setNoCache = res => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
}

const setContentType = (res, contentType) => {
  res.setHeader('Content-Type', contentType)
}

/**
 * organization: name of the organization (required)
 * start: start block off date ('YYYY-MM-DD', required)
 * end: end block off date ('YYYY-MM-DD', required)
 * columns: comma separated list of columns to return (optional)
 */
api.get('/flights', async (req, res) => {
  const flights = await collectFlights(
    admin.firestore(),
    {
      organization: req.query.organization,
      startDate: req.query.start,
      endDate: req.query.end,
      columns: req.query.columns
    },
    req.user
  )

  setNoCache(res)
  setContentType(res, 'text/csv')

  csv.writeToStream(res, flights, {
    headers: true
  })
})

api.get('/techlog-attachment', async (req, res) => {
  const { organization, aircraft, techlogEntry, name } = req.query
  const { originalName, contentType, data } = await getTechlogAttachment(
    admin.firestore(),
    admin.storage().bucket(),
    {
      organization,
      aircraft,
      techlogEntry,
      name
    },
    req.user
  )
  setContentType(res, contentType)
  res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`)
  res.end(data, 'binary')
})

exports.api = functions.https.onRequest(api)
