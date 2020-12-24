import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core'
import { flight as flightShape } from '../../../../../../shapes'
import FlightTag from './FlightTag'

const styles = {
  active: {
    backgroundColor: '#81c784'
  }
}

const Version = ({ flight, classes }) => (
  <FlightTag className={!flight.replacedWith ? classes.active : null}>
    <FormattedMessage
      id="flightlist.flight.version"
      values={{ version: flight.version }}
    />
  </FlightTag>
)

Version.propTypes = {
  flight: flightShape.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Version)
