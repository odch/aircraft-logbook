import React from 'react'
import { useIntl } from 'react-intl'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import { aircraft, flight } from '../../../../../../shapes'
import {
  formatDate,
  formatTime,
  getTimeDiff
} from '../../../../../../util/dates'

const FlightDetails = ({ aircraft, flight }) => {
  const intl = useIntl()
  return (
    <div>
      <Grid container>
        <Grid item xs={12} container>
          <Grid item xs={12} sm={4}>
            {renderField(
              'date',
              formatDate(
                flight.blockOffTime,
                flight.departureAerodrome.timezone
              ),
              intl
            )}
          </Grid>
          <Grid item xs={6} sm={4}>
            {renderField('pilot', getMemberName(flight.pilot), intl)}
          </Grid>
          <Grid item xs={6} sm={4}>
            {renderField('instructor', getMemberName(flight.instructor), intl)}
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={12} sm={4}>
            {renderField(
              'departureaerodrome',
              getAerodromeName(flight.departureAerodrome),
              intl
            )}
          </Grid>
          <Grid item xs={6} sm={4}>
            {renderField(
              'blockofftime',
              formatTimeWithUtc(
                flight.blockOffTime,
                flight.departureAerodrome.timezone
              ),
              intl
            )}
          </Grid>
          <Grid item xs={6} sm={4}>
            {renderField(
              'takeofftime',
              formatTimeWithUtc(
                flight.takeOffTime,
                flight.departureAerodrome.timezone
              ),
              intl
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={12} sm={4}>
            {renderField(
              'destinationaerodrome',
              getAerodromeName(flight.destinationAerodrome),
              intl
            )}
          </Grid>
          <Grid item xs={6} sm={4}>
            {renderField(
              'blockontime',
              formatTimeWithUtc(
                flight.blockOnTime,
                flight.destinationAerodrome.timezone
              ),
              intl
            )}
          </Grid>
          <Grid item xs={6} sm={4}>
            {renderField(
              'landingtime',
              formatTimeWithUtc(
                flight.landingTime,
                flight.destinationAerodrome.timezone
              ),
              intl
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={12} sm={4}>
            {renderField('nature', getFlightNature(flight.nature, intl), intl)}
          </Grid>
          <Grid item xs={12} sm={4}>
            {renderField(
              'fueluplift',
              getFuel(
                flight.fuelUplift,
                flight.fuelType,
                aircraft.settings.fuelTypes
              ),
              intl
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid item xs={12} sm={4}>
              {renderField('oiluplift', getOil(flight.oilUplift), intl)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={12} sm={4}>
            {renderField('landings', flight.landings, intl)}
          </Grid>
          <Grid item xs={12} sm={4}>
            {renderField('personsonboard', flight.personsOnBoard || '-', intl)}
          </Grid>
          <Grid item xs={12} sm={8}>
            {renderField('remarks', flight.remarks || '-', intl, true)}
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={6} sm={4}>
            {renderField(
              'flighthours_time',
              getTimeDiff(flight.takeOffTime, flight.landingTime),
              intl
            )}
          </Grid>
          <Grid item xs={6} sm={4}>
            {renderField(
              'blockhours',
              getTimeDiff(flight.blockOffTime, flight.blockOnTime),
              intl
            )}
          </Grid>
        </Grid>
        {flight.counters && (
          <Grid item xs={12} container>
            {flight.counters.flightTimeCounter && (
              <Grid item xs={6} sm={4}>
                {renderField(
                  'flighthours_counter',
                  getDecimalRange(flight.counters.flightTimeCounter),
                  intl
                )}
              </Grid>
            )}
            {flight.counters.engineTimeCounter && (
              <Grid item xs={6} sm={4}>
                {aircraft.settings.engineHoursCounterEnabled &&
                  renderField(
                    'enginehours',
                    getDecimalRange(flight.counters.engineTimeCounter),
                    intl
                  )}
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
      <Divider />
      <Grid item xs={12} container>
        <Grid item xs={6} sm={4}>
          {renderField(
            'total.flighthours',
            format2Decimals(flight.counters.flightHours.end),
            intl
          )}
        </Grid>
        {flight.counters.engineHours && (
          <Grid item xs={6} sm={4}>
            {renderField(
              'total.enginehours',
              format2Decimals(flight.counters.engineHours.end),
              intl
            )}
          </Grid>
        )}
        <Grid item xs={6} sm={4}>
          {renderField('total.landings', flight.counters.landings.end, intl)}
        </Grid>
      </Grid>
    </div>
  )
}

const renderField = (label, value, intl, multiline = false) => (
  <TextField
    label={intl.formatMessage({ id: `flightlist.${label}` })}
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

const getMemberName = member =>
  member ? `${member.firstname} ${member.lastname}` : '-'

const getAerodromeName = aerodrome =>
  `${aerodrome.identification} (${aerodrome.name})`

const getFlightNature = (nature, intl) =>
  intl.formatMessage({ id: `flight.nature.${nature}` })

const getFuel = (fuelUplift, fuelType, aircraftFuelTypes) =>
  fuelUplift && fuelUplift > 0
    ? `${fuelUplift}L (${getFuelTypeDescription(fuelType, aircraftFuelTypes)})`
    : '-'

const getFuelTypeDescription = (fuelType, aircraftFuelTypes) => {
  const foundType = aircraftFuelTypes.find(type => type.name === fuelType)
  if (foundType && foundType.description) {
    return foundType.description
  }
  return fuelType
}

const getOil = oilUplift => (oilUplift && oilUplift > 0 ? `${oilUplift}L` : '-')

const getDecimalRange = range => {
  const diff = range.end - range.start

  const startFormatted = format2Decimals(range.start)
  const endFormatted = format2Decimals(range.end)
  const diffFormatted = format2Decimals(diff)

  return `${diffFormatted} (${startFormatted} - ${endFormatted})`
}

const format2Decimals = value => Number(value / 100).toFixed(2)

const formatTimeWithUtc = (timestamp, timezone) =>
  `${formatTime(timestamp, timezone)} (${formatTime(timestamp, 'UTC')} UTC)`

FlightDetails.propTypes = {
  aircraft,
  flight
}

export default FlightDetails
