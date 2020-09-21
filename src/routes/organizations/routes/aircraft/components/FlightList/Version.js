import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { flight } from '../../../../../../shapes'

const styles = theme => ({
  version: {
    textTransform: 'uppercase',
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.typography.pxToRem(5),
    padding: theme.typography.pxToRem(5),
    display: 'inline-block',
    verticalAlign: 'top',
    fontSize: '0.8em'
  },
  active: {
    backgroundColor: '#81c784'
  }
})

const Version = ({ flight, classes }) => (
  <Typography
    component="span"
    className={classNames(
      classes.version,
      !flight.replacedWith && classes.active
    )}
  >
    <FormattedMessage
      id="flightlist.flight.version"
      values={{ version: flight.version }}
    />
  </Typography>
)

Version.propTypes = {
  flight: flight.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Version)
