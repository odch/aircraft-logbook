import React from 'react'
import { useIntl } from 'react-intl'
import Grid from '@material-ui/core/Grid'
import { aircraft, flight } from '../../../../../../shapes'
import { formatDate } from '../../../../../../util/dates'
import {
  renderField,
  formatTimeWithUtc,
  getMemberName,
  getAerodromeName,
  formatCorrection,
  renderCorrectionSets
} from '../../util/formatUtils'
import FlightFooter from './FlightFooter'

const CorrectionFlightDetails = ({ aircraft, flight }) => {
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
            {renderField(
              'time',
              formatTimeWithUtc(
                flight.blockOffTime,
                flight.departureAerodrome.timezone
              ),
              intl
            )}
          </Grid>
          <Grid item xs={6} sm={4}>
            {renderField('pilot', getMemberName(flight.pilot), intl)}
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={12}>
            {flight.remarks &&
              renderField(
                'correctionremarks',
                flight.remarks || '-',
                intl,
                true
              )}
          </Grid>
        </Grid>
        <Grid item xs={12} container>
          {flight.departureAerodrome.identification !==
            flight.destinationAerodrome.identification && (
            <>
              <Grid item xs={12}>
                {renderField(
                  'aerodrome',
                  formatCorrection(
                    getAerodromeName(flight.departureAerodrome),
                    getAerodromeName(flight.destinationAerodrome)
                  ),
                  intl
                )}
              </Grid>
            </>
          )}
        </Grid>
        {renderCorrectionSets(
          flight.counters,
          [
            {
              name: 'flightHours',
              label: 'flighthours',
              type: 'decimal'
            },
            {
              name: 'flightTimeCounter',
              label: 'flighthours_counter',
              type: 'decimal'
            },
            { name: 'landings', label: 'landings' },
            {
              name: 'engineHours',
              label: 'enginehours',
              type: 'decimal',
              fractionDigits: aircraft.settings.engineHoursCounterFractionDigits
            },
            {
              name: 'engineTimeCounter',
              label: 'enginetimecounter',
              type: 'decimal',
              fractionDigits: aircraft.settings.engineHoursCounterFractionDigits
            },
            {
              name: 'engineTachHours',
              label: 'enginetachhours',
              type: 'decimal',
              fractionDigits:
                aircraft.settings.engineTachHoursCounterFractionDigits
            },
            {
              name: 'engineTachCounter',
              label: 'enginetachcounter',
              type: 'decimal',
              fractionDigits:
                aircraft.settings.engineTachHoursCounterFractionDigits
            }
          ],
          intl
        )}
      </Grid>
      <FlightFooter flight={flight} aircraft={aircraft} />
    </div>
  )
}

CorrectionFlightDetails.propTypes = {
  aircraft,
  flight
}

export default CorrectionFlightDetails
