# aircraft-logbook
[![Build Status](https://travis-ci.org/odch/aircraft-logbook.svg?branch=master)](https://travis-ci.org/odch/aircraft-logbook)
[![codecov](https://codecov.io/gh/odch/aircraft-logbook/branch/master/graph/badge.svg)](https://codecov.io/gh/odch/aircraft-logbook)
[![dependencies Status](https://david-dm.org/odch/aircraft-logbook/status.svg)](https://david-dm.org/odch/aircraft-logbook)
[![devDependencies Status](https://david-dm.org/odch/aircraft-logbook/dev-status.svg)](https://david-dm.org/odch/aircraft-logbook?type=dev)

## Getting started

```
yarn install
yarn start
```

Open http://localhost:8080 and start developing.

## REST API

URL: https://us-central1-odch-aircraft-logbook-dev.cloudfunctions.net/api

### Authentication

Use the `Authorization` header with content `Bearer {Firebase Access Token}` to authenticate.

### Resources

#### Flights

`GET /api/flights`

Content-Type: `text/csv`

The flights are ordered by aircraft registration first and then by block off date.

Query Parameters:
* `organization`: ID of the organization (required)
* `start`: Start block off date in pattern `YYYY-MM-DD` (required)
* `end`: End block off date in pattern `YYYY-MM-DD` (required)
* `fields`: Comma separated list of columns to include in the report (optional; all fields by default)

**Note**: The requesting user must be a manager of the organization to be able to get the flights.

## Cloud Functions Config

### Organization Member Invitation Mail

Set the following config options using the command `firebase function:config:set ${name}={value}`
(e.g.`firebase functions:config:set invite.sender.port=465`)

* `invite.sender.host`: SMTP host name (e.g. "smtp.mailgun.org")
* `invite.sender.port`: SMTP port number (e.g. 465)
* `invite.sender.user`: SMTP user name (e.g. "odch@xyz.mailgun.org")
* `invite.sender.password`: Password of the SMTP user (e.g. "xyz123")
* `invite.sender.email`: Address to send the invitation mail from (e.g. "noreply@opendigital.ch")
* `invite.url`: Base web address for the invitation link in the mail (e.g. "https://logbook.opendigital.ch")
