import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core'
import { flight as flightShape } from '../../../../../../shapes'
import FlightTag from './FlightTag'

const styles = theme => ({
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
  <FlightTag
    className={classNames(
      flight.replacedWith ? classes.replaced : classes.deleted,
      className
    )}
  >
    <FormattedMessage
      id={`flightlist.flight.${flight.replacedWith ? 'replaced' : 'deleted'}`}
    />
  </FlightTag>
)

DeletionStatus.propTypes = {
  flight: flightShape.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
}

export default withStyles(styles)(DeletionStatus)
