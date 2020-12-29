import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import { formatDate, formatTime } from '../../../../../../util/dates'
import { flight as flightShape } from '../../../../../../shapes'
import DeletionStatus from './DeletionStatus'
import Version from './Version'
import FlightTag from './FlightTag'

const styles = theme => ({
  flightHeading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '100%',
    flexShrink: 0,
    [theme.breakpoints.up(700 + theme.spacing(3 * 2))]: {
      flexBasis: '50%'
    }
  },
  flightSecondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  bold: {
    fontWeight: 'bold'
  },
  deletionStatus: {
    marginRight: '0.5em'
  }
})

const FlightSummary = ({ flight, showDeleted, classes }) => (
  <>
    <div className={classes.flightHeading}>
      <Typography>
        {flight.correction === true ? (
          <FormattedMessage
            id="flightlist.correctionflight.heading"
            values={{
              firstname: flight.pilot.firstname,
              lastname: flight.pilot.lastname
            }}
          />
        ) : flight.version === 0 ? (
          <FormattedMessage
            id="flightlist.flight.heading.draft"
            values={{
              departureAerodrome: (
                <span className={classes.bold}>
                  {flight.departureAerodrome.identification}
                </span>
              ),
              firstname: flight.pilot.firstname,
              lastname: flight.pilot.lastname
            }}
          />
        ) : (
          <FormattedMessage
            id="flightlist.flight.heading"
            values={{
              departureAerodrome: (
                <span className={classes.bold}>
                  {flight.departureAerodrome.identification}
                </span>
              ),
              destinationAerodrome: (
                <span className={classes.bold}>
                  {flight.destinationAerodrome.identification}
                </span>
              ),
              firstname: flight.pilot.firstname,
              lastname: flight.pilot.lastname
            }}
          />
        )}
      </Typography>
      {flight.deleted === true && (
        <DeletionStatus flight={flight} className={classes.deletionStatus} />
      )}
      {flight.version === 0 && (
        <FlightTag>
          <FormattedMessage id="flightlist.flight.version.preflight" />
        </FlightTag>
      )}
      {showDeleted &&
        flight.version > 0 &&
        (flight.replacedWith || flight.replaces) && <Version flight={flight} />}
    </div>
    {flight.correction === true ? (
      <Typography className={classes.flightSecondaryHeading}>
        {formatDate(flight.blockOffTime, flight.departureAerodrome.timezone)},{' '}
        {formatTime(flight.blockOffTime, flight.departureAerodrome.timezone)}
      </Typography>
    ) : flight.version === 0 ? (
      <Typography className={classes.flightSecondaryHeading}>
        {formatDate(flight.blockOffTime, flight.departureAerodrome.timezone)}
      </Typography>
    ) : (
      <Typography className={classes.flightSecondaryHeading}>
        {formatDate(flight.blockOffTime, flight.departureAerodrome.timezone)},{' '}
        {formatTime(flight.blockOffTime, flight.departureAerodrome.timezone)}-
        {formatTime(flight.blockOnTime, flight.destinationAerodrome.timezone)}
      </Typography>
    )}
  </>
)

FlightSummary.propTypes = {
  flight: flightShape.isRequired,
  showDeleted: PropTypes.bool,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FlightSummary)
