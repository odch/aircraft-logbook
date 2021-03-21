import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import featureToggles from 'feature-toggles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import isLoaded from '../../../../../../util/isLoaded'
import {
  organization as organizationShape,
  intl as intlShape
} from '../../../../../../shapes'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import DeleteButton from '../../../../../../components/DeleteButton'
import ExpiredNotification from '../../../../components/ExpiredNotification'
import OrganizationDeleteDialog from '../OrganizationDeleteDialog'
import MemberList from '../../containers/MemberListContainer'
import LockDateForm from '../../containers/LockDateFormContainer'
import ExportFlightsForm from '../../containers/ExportFlightsFormContainer'
import ReadonlyAccessSwitch from '../../containers/ReadonlyAccessSwitchContainer'

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
  }
})

class OrganizationSettings extends React.Component {
  state = {
    deleteDialogOpen: false
  }

  handleFlightsExportClick = () => {
    this.props.exportFlights()
  }

  handleDeleteButtonClick = () => {
    this.setState({
      deleteDialogOpen: true
    })
  }

  onDeleteDialogClose = () => {
    this.setState({
      deleteDialogOpen: false
    })
  }

  isOrganizationManager = () =>
    this.props.organization.roles.includes('manager')

  render() {
    const { organization, classes, deleteOrganization } = this.props

    if (!isLoaded(organization)) {
      return <LoadingIcon />
    }

    if (!organization) {
      return <Redirect to="/" />
    }

    if (!this.isOrganizationManager()) {
      return <Redirect to="/" />
    }

    return (
      <div className={classes.container}>
        {organization.expired && <ExpiredNotification />}
        <Typography variant="h4" data-cy="organization-title" gutterBottom>
          {organization.id}
        </Typography>
        <MemberList organization={organization} />
        <LockDateForm organizationId={organization.id} />
        <ExportFlightsForm organizationId={organization.id} />
        <ReadonlyAccessSwitch organization={organization} />
        {featureToggles.isFeatureEnabled('organizationsManagement') && (
          <React.Fragment>
            <Divider className={classes.divider} />
            <div className={classes.deleteButtonContainer}>
              <DeleteButton
                label={this.props.intl.formatMessage({
                  id: 'organizations.delete'
                })}
                onClick={this.handleDeleteButtonClick}
                data-cy="organization-delete-button"
              />
            </div>
          </React.Fragment>
        )}
        <OrganizationDeleteDialog
          organizationId={organization.id}
          open={this.state.deleteDialogOpen}
          onConfirm={() => deleteOrganization(organization.id)}
          onClose={this.onDeleteDialogClose}
        />
      </div>
    )
  }
}

OrganizationSettings.propTypes = {
  organization: organizationShape,
  classes: PropTypes.object.isRequired,
  exportFlights: PropTypes.func.isRequired,
  deleteOrganization: PropTypes.func.isRequired,
  intl: intlShape
}

export default withStyles(styles)(injectIntl(OrganizationSettings))
