import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FlightDeleteDialog from '../FlightDeleteDialog'
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
    const {
      organization,
      aircraft,
      flights,
      flightDeleteDialog,
      classes,
      openFlightDeleteDialog,
      closeFlightDeleteDialog,
      deleteFlight
    } = this.props
    return (
      <React.Fragment>
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
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map(flight => {
              return (
                <TableRow key={flight.id}>
                  <TableCell>{formatDate(flight.blockOffTime)}</TableCell>
                  <TableCell>
                    {`${flight.pilot.firstname} ${flight.pilot.lastname}`}
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
                  <TableCell>
                    <IconButton onClick={() => openFlightDeleteDialog(flight)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {flightDeleteDialog.open && (
          <FlightDeleteDialog
            organizationId={organization.id}
            aircraft={aircraft}
            flight={flightDeleteDialog.flight}
            submitted={flightDeleteDialog.submitted}
            onConfirm={() =>
              deleteFlight(
                organization.id,
                aircraft.id,
                flightDeleteDialog.flight.id
              )
            }
            onClose={closeFlightDeleteDialog}
          />
        )}
      </React.Fragment>
    )
  }
}

FlightList.propTypes = {
  organization: organizationShape,
  aircraft: aircraftShape,
  flights: PropTypes.arrayOf(flightShape),
  flightDeleteDialog: PropTypes.shape({
    open: PropTypes.bool,
    submitted: PropTypes.bool,
    flight: flightShape
  }),
  classes: PropTypes.object.isRequired,
  openFlightDeleteDialog: PropTypes.func.isRequired,
  closeFlightDeleteDialog: PropTypes.func.isRequired,
  deleteFlight: PropTypes.func.isRequired
}

export default withStyles(styles)(FlightList)
