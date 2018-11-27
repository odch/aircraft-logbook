import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { injectIntl, intlShape } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import isLoaded from '../../../../../../util/isLoaded'
import { organization as organizationShape } from '../../../../../../shapes'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import DeleteButton from '../../../../../../components/DeleteButton'
import OrganizationDeleteDialog from '../OrganizationDeleteDialog/OrganizationDeleteDialog'

const styles = theme => ({
  container: {
    padding: '1em',
    [theme.breakpoints.up(1000 + theme.spacing.unit * 3 * 2)]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  divider: {
    margin: theme.spacing.unit / 5 + 'em'
  },
  deleteButtonContainer: {
    textAlign: 'center'
  }
})

class OrganizationSettings extends React.Component {
  state = {
    deleteDialogOpen: false
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
    const { organization, classes, deleteOrganization } = this.props

    if (!isLoaded(organization)) {
      return <LoadingIcon />
    }

    if (!organization) {
      return <Redirect to="/" />
    }

    return (
      <div className={classes.container}>
        <Typography variant="title" data-cy="organization-title">
          {organization.id}
        </Typography>
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
  deleteOrganization: PropTypes.func.isRequired,
  intl: intlShape
}

export default withStyles(styles)(injectIntl(OrganizationSettings))