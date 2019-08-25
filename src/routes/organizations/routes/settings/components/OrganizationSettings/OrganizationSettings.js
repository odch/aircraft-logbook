import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import featureToggles from 'feature-toggles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import isLoaded from '../../../../../../util/isLoaded'
import {
  organization as organizationShape,
  intl as intlShape
} from '../../../../../../shapes'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import DeleteButton from '../../../../../../components/DeleteButton'
import CreateMemberDialog from '../../containers/CreateMemberDialogContainer'
import OrganizationDeleteDialog from '../OrganizationDeleteDialog'
import MemberList from '../../containers/MemberListContainer'

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

  handleCreateMemberClick = () => {
    this.props.openCreateMemberDialog()
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

  render() {
    const {
      organization,
      createMemberDialogOpen,
      classes,
      deleteOrganization
    } = this.props

    if (!isLoaded(organization)) {
      return <LoadingIcon />
    }

    if (!organization) {
      return <Redirect to="/" />
    }

    return (
      <div className={classes.container}>
        <Typography variant="h4" data-cy="organization-title" gutterBottom>
          {organization.id}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleCreateMemberClick}
        >
          <FormattedMessage id="organization.settings.createmember" />
        </Button>
        <MemberList organizationId={organization.id} />
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
        {createMemberDialogOpen && (
          <CreateMemberDialog organizationId={organization.id} />
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
  createMemberDialogOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  openCreateMemberDialog: PropTypes.func.isRequired,
  deleteOrganization: PropTypes.func.isRequired,
  intl: intlShape
}

export default withStyles(styles)(injectIntl(OrganizationSettings))
