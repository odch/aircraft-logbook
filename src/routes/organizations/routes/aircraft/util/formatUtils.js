import React from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { formatTime } from '../../../../../util/dates'

export const renderField = (label, value, intl, multiline = false) => (
  <TextField
    label={intl.formatMessage({ id: `flightlist.${label.toLowerCase()}` })}
    value={value}
    margin="normal"
    InputProps={{
      readOnly: true,
      disableUnderline: true
    }}
    fullWidth
    multiline={multiline}
  />
)

export const getMemberName = member =>
  member ? `${member.firstname} ${member.lastname}` : '-'

export const getAerodromeName = aerodrome =>
  `${aerodrome.identification} (${aerodrome.name})`

export const formatDecimalNumber = (value, fractionDigits = 2) =>
  roundDecimalNumber(value / 100, fractionDigits).toFixed(fractionDigits)

export const roundDecimalNumber = (value, fractionDigits = 2) => {
  const roundingFactor = fractionDigits === 1 ? 10 : 100
  return Number(Math.round(value * roundingFactor) / roundingFactor)
}

export const formatTimeWithUtc = (timestamp, timezone) =>
  `${formatTime(timestamp, timezone)} (${formatTime(timestamp, 'UTC')} UTC)`

export const formatCorrection = (start, end) => `${start} → ${end}`

export const renderCorrectionSets = (counters, names, intl) =>
  names.map(counter => renderCorrectionSet(counters, counter, intl))

const FORMATTERS = {
  decimal: (value, conf) => formatDecimalNumber(value, conf.fractionDigits)
}

const format = (value, conf) => {
  const formatter = FORMATTERS[conf.type] || (val => val)
  return formatter(value, conf)
}

export const renderCorrectionSet = (counters, counter, intl) => (
  <Grid item xs={12} container key={counter.name}>
    {counters[counter.name] &&
      counters[counter.name].start !== counters[counter.name].end && (
        <>
          <Grid item xs={12}>
            {renderField(
              counter.label,
              formatCorrection(
                format(counters[counter.name].start, counter),
                format(counters[counter.name].end, counter)
              ),
              intl
            )}
          </Grid>
        </>
      )}
  </Grid>
)
