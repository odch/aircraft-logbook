import React from 'react'
import { injectIntl } from 'react-intl'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import { aircraft, flight, intl as intlShape } from '../../../../../../shapes'
import { renderField, formatDecimalNumber } from '../../util/formatUtils'
import Timestamp from './Timestamp'

const FlightFooter = ({ flight, aircraft, intl }) => (
  <>
    <Divider />
    <Grid item xs={12} container>
      <Grid item xs={6} sm={4}>
        {renderField(
          'total.flighthours',
          formatDecimalNumber(flight.counters.flightHours.end),
          intl
        )}
      </Grid>
      {flight.counters.engineHours && (
        <Grid item xs={6} sm={4}>
          {renderField(
            'total.enginehours',
            formatDecimalNumber(
              flight.counters.engineHours.end,
              aircraft.settings.engineHoursCounterFractionDigits
            ),
            intl
          )}
        </Grid>
      )}
      <Grid item xs={6} sm={4}>
        {renderField('total.landings', flight.counters.landings.end, intl)}
      </Grid>
    </Grid>
    {flight.createTimestamp && (
      <Grid item xs={12} container>
        <Grid item xs={12}>
          <Timestamp
            operation="created"
            timestamp={flight.createTimestamp}
            member={flight.owner}
          />
          {flight.deleteTimestamp && (
            <Timestamp
              operation={flight.replacedWith ? 'replaced' : 'deleted'}
              timestamp={flight.deleteTimestamp}
              member={flight.deletedBy}
            />
          )}
        </Grid>
      </Grid>
    )}
  </>
)

FlightFooter.propTypes = {
  aircraft: aircraft.isRequired,
  flight: flight.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(FlightFooter)
