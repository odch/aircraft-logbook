import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Redirect } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import isLoaded from '../../../../../../util/isLoaded'
import {
  organization as organizationShape,
  aircraft as aircraftShape,
  flight as flightShape
} from '../../../../../../shapes'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import FlightList from '../FlightList'

const styles = theme => ({
  container: {
    padding: '1em',
    [theme.breakpoints.up(1000 + theme.spacing.unit * 3 * 2)]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }
})

class AircraftDetail extends React.Component {
  componentDidMount() {
    if (this.props.organization) {
      this.props.fetchAircrafts(this.props.organization.id)

      if (this.props.aircraft) {
        this.props.fetchFlights(
          this.props.organization.id,
          this.props.aircraft.id
        )
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.organization &&
      (!prevProps.organization ||
        prevProps.organization.id !== this.props.organization.id)
    ) {
      this.props.fetchAircrafts(this.props.organization.id)
    }

    if (
      this.props.organization &&
      this.props.aircraft &&
      (!prevProps.aircraft || prevProps.aircraft.id !== this.props.aircraft.id)
    ) {
      this.props.fetchFlights(
        this.props.organization.id,
        this.props.aircraft.id
      )
    }
  }

  render() {
    const { organization, aircraft, flights, classes } = this.props

    if (organization === null) {
      return <Redirect to="/" />
    }

    if (aircraft === null) {
      return <Redirect to={`/organizations/${organization.id}`} />
    }

    if (!isLoaded(organization) || !isLoaded(aircraft) || !isLoaded(flights)) {
      return <LoadingIcon />
    }

    return (
      <div className={classes.container}>
        <Typography variant="display1" gutterBottom>
          {aircraft.registration}
        </Typography>
        <Typography variant="title" gutterBottom>
          <FormattedMessage id="aircraftdetail.lastflights" />
        </Typography>
        {flights.length > 0 ? (
          <FlightList
            organization={organization}
            aircraft={aircraft}
            flights={flights}
          />
        ) : (
          <Typography paragraph>
            <FormattedMessage id="aircraftdetail.noflights" />
          </Typography>
        )}
      </div>
    )
  }
}

AircraftDetail.propTypes = {
  organization: organizationShape,
  aircraft: aircraftShape,
  flights: PropTypes.arrayOf(flightShape),
  classes: PropTypes.object.isRequired,
  fetchAircrafts: PropTypes.func.isRequired,
  fetchFlights: PropTypes.func.isRequired
}

export default withStyles(styles)(AircraftDetail)
