import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { formatDate, formatTime } from '../../../../../../util/dates'

const styles = {
  timestamp: {
    fontStyle: 'italic',
    fontSize: '0.8em'
  }
}

const Timestamp = ({
  operation,
  timestamp,
  member: { firstname, lastname },
  classes
}) => (
  <Typography color="textSecondary" className={classes.timestamp}>
    <FormattedMessage
      id={`flightlist.flight.timestamp.${operation}`}
      values={{
        timestamp: `${formatDate(timestamp)} ${formatTime(timestamp)}`,
        member: `${firstname} ${lastname}`
      }}
    />
  </Typography>
)

Timestamp.propTypes = {
  operation: PropTypes.oneOf(['created', 'deleted', 'replaced']).isRequired,
  timestamp: PropTypes.object.isRequired,
  member: PropTypes.shape({
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired
  }).isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Timestamp)
