import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { flight as flightShape } from '../../../../../../shapes'

const styles = theme => ({
  status: {
    textTransform: 'uppercase',
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.typography.pxToRem(5),
    padding: theme.typography.pxToRem(5),
    display: 'inline-block',
    verticalAlign: 'top',
    fontSize: '0.8em'
  },
  deleted: {
    backgroundColor: theme.palette.error.dark,
    color: '#fff'
  },
  replaced: {
    backgroundColor: '#e5be73',
    color: '#000'
  }
})

const DeletionStatus = ({ flight, classes, className }) => (
  <Typography
    component="span"
    className={classNames(
      classes.status,
      flight.replacedWith ? classes.replaced : classes.deleted,
      className
    )}
  >
    <FormattedMessage
      id={`flightlist.flight.${flight.replacedWith ? 'replaced' : 'deleted'}`}
    />
  </Typography>
)

DeletionStatus.propTypes = {
  flight: flightShape.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
}

export default withStyles(styles)(DeletionStatus)
