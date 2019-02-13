import React from 'react'
import { injectIntl, intlShape } from 'react-intl'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { aircraft, flight } from '../../../../../../shapes'
import { formatDate, formatTime } from '../../../../../../util/dates'

const FlightDetails = ({ aircraft, flight, intl }) => {
  return (
    <Grid container>
      <Grid item xs={12} container>
        <Grid item xs={12} sm={4}>
          {renderField('date', formatDate(flight.blockOffTime), intl)}
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
          {renderField('blockofftime', formatTime(flight.blockOffTime), intl)}
        </Grid>
        <Grid item xs={6} sm={4}>
          {renderField('takeofftime', formatTime(flight.takeOffTime), intl)}
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
          {renderField('landingtime', formatTime(flight.landingTime), intl)}
        </Grid>
        <Grid item xs={6} sm={4}>
          {renderField('blockontime', formatTime(flight.blockOnTime), intl)}
        </Grid>
      </Grid>
      {flight.counters && (
        <Grid item xs={12} container>
          {flight.counters.flightHours && (
            <Grid item xs={6} sm={4}>
              {renderField(
                'flighthours',
                getDecimalRange(flight.counters.flightHours),
                intl
              )}
            </Grid>
          )}
          {flight.counters.engineHours && (
            <Grid item xs={6} sm={4}>
              {aircraft.settings.engineHoursCounterEnabled &&
                renderField(
                  'enginehours',
                  getDecimalRange(flight.counters.engineHours),
                  intl
                )}
            </Grid>
          )}
        </Grid>
      )}
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
        <Grid item xs={12} sm={8}>
          {renderField('remarks', flight.remarks || '-', intl)}
        </Grid>
      </Grid>
    </Grid>
  )
}

const renderField = (label, value, intl) => (
  <TextField
    label={intl.formatMessage({ id: `flightlist.${label}` })}
    value={value}
    margin="normal"
    InputProps={{
      readOnly: true,
      disableUnderline: true
    }}
    fullWidth
  />
)

const getMemberName = member =>
  member ? `${member.firstname} ${member.lastname}` : '-'

const getAerodromeName = aerodrome =>
  `${aerodrome.name} (${aerodrome.identification})`

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

const getDecimalRange = range =>
  `${Number(range.start / 100).toFixed(2)} - ${Number(range.end / 100).toFixed(
    2
  )}`

FlightDetails.propTypes = {
  aircraft,
  flight,
  intl: intlShape
}

export default injectIntl(FlightDetails)
