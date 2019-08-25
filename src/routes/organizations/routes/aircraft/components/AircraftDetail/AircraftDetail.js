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
    [theme.breakpoints.up(1000 + theme.spacing(3 * 2))]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }
})

class AircraftDetail extends React.Component {
  handleCreateClick = () => {
    const { organization, aircraft } = this.props
    this.props.openCreateFlightDialog()
    this.props.initCreateFlightDialog(organization.id, aircraft.id)
  }

  componentDidMount() {
    const {
      organization,
      aircraft,
      flightsPagination,
      fetchAircrafts,
      fetchMembers,
      fetchFlights
    } = this.props

    if (organization) {
      fetchAircrafts(organization.id)
      fetchMembers(organization.id)

      if (aircraft) {
        fetchFlights(
          organization.id,
          aircraft.id,
          flightsPagination.page,
          flightsPagination.rowsPerPage
        )
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      organization,
      aircraft,
      flightsPagination,
      fetchAircrafts,
      fetchMembers,
      fetchFlights
    } = this.props

    if (
      organization &&
      (!prevProps.organization || prevProps.organization.id !== organization.id)
    ) {
      fetchAircrafts(organization.id)
      fetchMembers(organization.id)
    }

    if (
      organization &&
      aircraft &&
      (!prevProps.aircraft ||
        prevProps.aircraft.id !== aircraft.id ||
        prevProps.flightsPagination.page !== flightsPagination.page ||
        prevProps.flightsPagination.rowsPerPage !==
          flightsPagination.rowsPerPage)
    ) {
      fetchFlights(
        organization.id,
        aircraft.id,
        flightsPagination.page,
        flightsPagination.rowsPerPage
      )
    }
  }

  render() {
    const {
      organization,
      aircraft,
      flights,
      flightDeleteDialog,
      flightsPagination,
      classes,
      createFlightDialogOpen,
      openDeleteFlightDialog,
      closeDeleteFlightDialog,
      deleteFlight,
      setFlightsPage
    } = this.props

    if (!isLoaded(organization) || !isLoaded(aircraft) || !isLoaded(flights)) {
      return <LoadingIcon />
    }

    if (organization === null) {
      return <Redirect to="/" />
    }

    if (aircraft === null) {
      return <Redirect to={`/organizations/${organization.id}`} />
    }

    return (
      <div className={classes.container}>
        <Typography variant="h4" gutterBottom>
          {aircraft.registration}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleCreateClick}
        >
          <FormattedMessage id="aircraftdetail.createflight" />
        </Button>
        {flights.length > 0 ? (
          <FlightList
            organization={organization}
            aircraft={aircraft}
            flights={flights}
            flightDeleteDialog={flightDeleteDialog}
            pagination={flightsPagination}
            openFlightDeleteDialog={openDeleteFlightDialog}
            closeFlightDeleteDialog={closeDeleteFlightDialog}
            deleteFlight={deleteFlight}
            setFlightsPage={setFlightsPage}
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
  flightsPagination: PropTypes.shape({
    rowsCount: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
  }),
  classes: PropTypes.object.isRequired,
  createFlightDialogOpen: PropTypes.bool.isRequired,
  flightDeleteDialog: PropTypes.shape({
    open: PropTypes.bool,
    submitted: PropTypes.bool,
    flight: flightShape
  }).isRequired,
  fetchAircrafts: PropTypes.func.isRequired,
  fetchMembers: PropTypes.func.isRequired,
  fetchFlights: PropTypes.func.isRequired,
  openCreateFlightDialog: PropTypes.func.isRequired,
  initCreateFlightDialog: PropTypes.func.isRequired,
  openDeleteFlightDialog: PropTypes.func.isRequired,
  closeDeleteFlightDialog: PropTypes.func.isRequired,
  deleteFlight: PropTypes.func.isRequired,
  setFlightsPage: PropTypes.func.isRequired
}

export default withStyles(styles)(AircraftDetail)
