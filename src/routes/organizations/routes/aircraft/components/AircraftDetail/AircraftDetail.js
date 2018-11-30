import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Redirect } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import isLoaded from '../../../../../../util/isLoaded'
import {
  organization as organizationShape,
  aircraft as aircraftShape,
  flight as flightShape
} from '../../../../../../shapes'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import FlightList from '../FlightList'
import FlightCreateDialog from '../../containers/FlightCreateDialogContainer'

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
  handleCreateClick = () => {
    this.props.openCreateFlightDialog()
    this.props.initCreateFlightDialog()
  }

  componentDidMount() {
    if (this.props.organization) {
      this.props.fetchAircrafts(this.props.organization.id)
      this.props.fetchMembers(this.props.organization.id)

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
      this.props.fetchMembers(this.props.organization.id)
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
    const {
      organization,
      aircraft,
      flights,
      classes,
      createFlightDialogOpen
    } = this.props

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
        <Button variant="contained" onClick={this.handleCreateClick}>
          <FormattedMessage id="aircraftdetail.createflight" />
        </Button>
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
        {createFlightDialogOpen && (
          <FlightCreateDialog
            organizationId={organization.id}
            aircraftId={aircraft.id}
          />
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
  createFlightDialogOpen: PropTypes.bool.isRequired,
  fetchAircrafts: PropTypes.func.isRequired,
  fetchMembers: PropTypes.func.isRequired,
  fetchFlights: PropTypes.func.isRequired,
  openCreateFlightDialog: PropTypes.func.isRequired,
  initCreateFlightDialog: PropTypes.func.isRequired
}

export default withStyles(styles)(AircraftDetail)
