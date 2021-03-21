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
  check as checkShape,
  techlogEntry as techlogEntryShape
} from '../../../../../../shapes'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import FlightList from '../../containers/FlightListContainer'
import Techlog from '../../containers/TechlogContainer'
import Checks from '../Checks'
import LatestCrs from '../LatestCrs'
import ExpiredNotification from '../../../../components/ExpiredNotification'

const styles = theme => ({
  container: {
    padding: '1em',
    [theme.breakpoints.up(1000 + theme.spacing(3 * 2))]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  sectionHeading: {
    marginTop: '1.5em'
  },
  settingsButton: {
    float: 'right'
  }
})

class AircraftDetail extends React.Component {
  isOrganizationOrTechlogManager = () =>
    this.props.organization.roles.some(role =>
      ['manager', 'techlogmanager'].includes(role)
    )

  componentDidMount() {
    const {
      organization,
      aircraft,
      fetchAircrafts,
      fetchMembers,
      fetchAerodromes,
      fetchChecks,
      fetchLatestCrs
    } = this.props

    if (organization) {
      fetchAircrafts(organization.id)
      fetchMembers(organization.id)
      fetchAerodromes(organization.id)
      if (aircraft) {
        fetchChecks(organization.id, aircraft.id)
        fetchLatestCrs(organization.id, aircraft.id)
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      aircraft,
      organization,
      fetchAircrafts,
      fetchMembers,
      fetchAerodromes,
      fetchChecks,
      fetchLatestCrs
    } = this.props

    if (
      organization &&
      (!prevProps.organization || prevProps.organization.id !== organization.id)
    ) {
      fetchAircrafts(organization.id)
      fetchMembers(organization.id)
      fetchAerodromes(organization.id)
    }
    if (
      organization &&
      aircraft &&
      (!prevProps.aircraft || prevProps.aircraft.id !== aircraft.id)
    ) {
      fetchChecks(organization.id, aircraft.id)
      fetchLatestCrs(organization.id, aircraft.id)
    }
  }

  render() {
    const {
      organization,
      aircraft,
      checks,
      latestCrs,
      authToken,
      classes
    } = this.props

    if (organization === null) {
      return <Redirect to="/" />
    }

    if (!isLoaded(organization) || !isLoaded(aircraft)) {
      return <LoadingIcon />
    }

    if (aircraft === null) {
      return <Redirect to={`/organizations/${organization.id}`} />
    }

    if (!isLoaded(checks) || !isLoaded(latestCrs)) {
      return <LoadingIcon />
    }

    return (
      <div className={classes.container}>
        {organization.expired && <ExpiredNotification />}
        <Typography variant="h4" gutterBottom>
          {aircraft.registration}
          {this.isOrganizationOrTechlogManager() && (
            <Button
              href={`/organizations/${organization.id}/aircrafts/${aircraft.id}/settings`}
              color="primary"
              className={classes.settingsButton}
            >
              <FormattedMessage id="aircraftdetail.settings" />
            </Button>
          )}
        </Typography>
        {checks && checks.length > 0 && (
          <>
            <Typography
              variant="h5"
              gutterBottom
              className={classes.sectionHeading}
            >
              <FormattedMessage id="aircraftdetail.checks" />
            </Typography>
            <Checks checks={checks} counters={aircraft.counters} />
          </>
        )}
        {aircraft.settings.techlogEnabled === true && (
          <>
            <Typography
              variant="h5"
              gutterBottom
              className={classes.sectionHeading}
            >
              <FormattedMessage id="aircraftdetail.latestcrs" />
            </Typography>
            <LatestCrs
              organization={organization}
              aircraftId={aircraft.id}
              crs={latestCrs}
              authToken={authToken}
            />
            <Typography
              variant="h5"
              gutterBottom
              className={classes.sectionHeading}
            >
              <FormattedMessage id="aircraftdetail.techlog" />
            </Typography>
            <Techlog
              organization={organization}
              aircraft={aircraft}
              showOnlyOpen
            />
            <Button
              href={`/organizations/${organization.id}/aircrafts/${aircraft.id}/techlog`}
              color="primary"
            >
              <FormattedMessage id="aircraftdetail.techlog.all" />
            </Button>
          </>
        )}
        <Typography
          variant="h5"
          gutterBottom
          className={classes.sectionHeading}
        >
          <FormattedMessage id="aircraftdetail.flights" />
        </Typography>
        <FlightList
          organization={organization}
          aircraft={aircraft}
          rowsPerPage={5}
          hidePagination
          hideDeletedSwitch
        />
        <Button
          href={`/organizations/${organization.id}/aircrafts/${aircraft.id}/flights`}
          color="primary"
        >
          <FormattedMessage id="aircraftdetail.flights.all" />
        </Button>
      </div>
    )
  }
}

AircraftDetail.propTypes = {
  organization: organizationShape,
  aircraft: aircraftShape,
  checks: PropTypes.arrayOf(checkShape),
  latestCrs: techlogEntryShape,
  authToken: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  fetchAircrafts: PropTypes.func.isRequired,
  fetchMembers: PropTypes.func.isRequired,
  fetchAerodromes: PropTypes.func.isRequired,
  fetchChecks: PropTypes.func.isRequired,
  fetchLatestCrs: PropTypes.func.isRequired
}

export default withStyles(styles)(AircraftDetail)
