import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import isLoaded from '../../../../../../../../util/isLoaded'
import {
  organization as organizationShape,
  aircraft as aircraftShape,
  intl as intlShape
} from '../../../../../../../../shapes'
import LoadingIcon from '../../../../../../../../components/LoadingIcon'
import DeleteButton from '../../../../../../../../components/DeleteButton'
import Checks from '../../containers/ChecksContainer'
import FuelTypes from '../../containers/FuelTypesContainer'
import AdvancedSettings from '../../containers/AdvancedSettingsContainer'
import DeleteAircraftDialog from '../DeleteAircraftDialog'
import ReadonlyAccessLink from '../ReadonlyAccessLink'

const styles = theme => ({
  container: {
    padding: '1em',
    [theme.breakpoints.up(1000 + theme.spacing(3 * 2))]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  divider: {
    margin: theme.spacing(0.2) + 'em'
  },
  deleteButtonContainer: {
    textAlign: 'center'
  },
  closeSettingsButton: {
    float: 'right'
  }
})

class AircraftSettings extends React.Component {
  isOrganizationManager = () =>
    this.props.organization.roles.includes('manager')

  isTechlogManager = () =>
    this.props.organization.roles.includes('techlogmanager')

  componentDidMount() {
    const { organization, fetchAircrafts } = this.props

    if (organization) {
      fetchAircrafts(organization.id)
    }
  }

  componentDidUpdate(prevProps) {
    const { organization, fetchAircrafts } = this.props

    if (
      organization &&
      (!prevProps.organization || prevProps.organization.id !== organization.id)
    ) {
      fetchAircrafts(organization.id)
    }
  }

  render() {
    const {
      organization,
      aircraft,
      deleteAircraftDialog,
      classes,
      deleteAircraft,
      openDeleteAircraftDialog,
      closeDeleteAircraftDialog,
      intl
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

    if (!this.isOrganizationManager() && !this.isTechlogManager()) {
      return (
        <Redirect
          to={`/organizations/${organization.id}/aircrafts/${aircraft.id}`}
        />
      )
    }

    return (
      <div className={classes.container}>
        <Typography variant="h4" gutterBottom>
          {aircraft.registration}
          <Button
            href={`/organizations/${organization.id}/aircrafts/${aircraft.id}`}
            color="primary"
            className={classes.closeSettingsButton}
          >
            <FormattedMessage id="aircraft.settings.close" />
          </Button>
        </Typography>
        {(this.isOrganizationManager() || this.isTechlogManager()) && (
          <Checks organizationId={organization.id} aircraftId={aircraft.id} />
        )}
        {this.isOrganizationManager() && (
          <>
            <FuelTypes
              organizationId={organization.id}
              aircraftId={aircraft.id}
            />
            <AdvancedSettings
              organization={organization}
              aircraftId={aircraft.id}
            />
            <ReadonlyAccessLink organization={organization} />
            <Divider className={classes.divider} />
            <div className={classes.deleteButtonContainer}>
              <DeleteButton
                label={intl.formatMessage({
                  id: 'aircrafts.delete'
                })}
                onClick={openDeleteAircraftDialog}
                data-cy="aircraft-delete-button"
              />
            </div>
            <DeleteAircraftDialog
              organizationId={organization.id}
              aircraftId={aircraft.id}
              registration={aircraft.registration}
              open={deleteAircraftDialog.open}
              submitting={deleteAircraftDialog.submitting}
              onConfirm={() => deleteAircraft(organization.id, aircraft.id)}
              onClose={closeDeleteAircraftDialog}
            />
          </>
        )}
      </div>
    )
  }
}

AircraftSettings.propTypes = {
  organization: organizationShape,
  aircraft: aircraftShape,
  deleteAircraftDialog: PropTypes.shape({
    open: PropTypes.bool,
    submitting: PropTypes.bool
  }).isRequired,
  classes: PropTypes.object.isRequired,
  fetchAircrafts: PropTypes.func.isRequired,
  openDeleteAircraftDialog: PropTypes.func.isRequired,
  closeDeleteAircraftDialog: PropTypes.func.isRequired,
  deleteAircraft: PropTypes.func.isRequired,
  intl: intlShape
}

export default withStyles(styles)(injectIntl(AircraftSettings))
