import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {
  aircraft as aircraftShape,
  flight as flightShape,
  organization as organizationShape
} from '../../../../../../shapes'
import { formatDate, formatTime } from '../../../../../../util/dates'

const styles = theme => ({
  table: {
    padding: '1em',
    [theme.breakpoints.up(1000 + theme.spacing.unit * 3 * 2)]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  hiddenBelow800: {
    [theme.breakpoints.down(800 + theme.spacing.unit * 3 * 2)]: {
      display: 'none'
    }
  },
  hiddenBelow600: {
    [theme.breakpoints.down(600 + theme.spacing.unit * 3 * 2)]: {
      display: 'none'
    }
  }
})

class FlightList extends React.Component {
  render() {
    const { flights, classes } = this.props
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="flightlist.date" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="flightlist.pilot" />
            </TableCell>
            <TableCell className={classes.hiddenBelow600}>
              <FormattedMessage id="flightlist.departureaerodrome" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="flightlist.destinationaerodrome" />
            </TableCell>
            <TableCell className={classes.hiddenBelow800}>
              <FormattedMessage id="flightlist.blockofftime" />
            </TableCell>
            <TableCell className={classes.hiddenBelow800}>
              <FormattedMessage id="flightlist.blockontime" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flights.map(flight => {
            return (
              <TableRow key={flight.id}>
                <TableCell>{formatDate(flight.blockOffTime)}</TableCell>
                <TableCell>
                  {`${flight.member.firstname} ${flight.member.lastname}`}
                </TableCell>
                <TableCell className={classes.hiddenBelow600}>
                  {flight.departureAerodrome.name}
                </TableCell>
                <TableCell>{flight.destinationAerodrome.name}</TableCell>
                <TableCell className={classes.hiddenBelow800}>
                  {formatTime(flight.blockOffTime)}
                </TableCell>
                <TableCell className={classes.hiddenBelow800}>
                  {formatTime(flight.blockOnTime)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }
}

FlightList.propTypes = {
  organization: organizationShape,
  aircraft: aircraftShape,
  flights: PropTypes.arrayOf(flightShape),
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FlightList)
