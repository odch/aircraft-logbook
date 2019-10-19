import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import featureToggles from 'feature-toggles'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CreateNewFolder from '@material-ui/icons/CreateNewFolder'
import isLoaded from '../../../../util/isLoaded'
import { organization } from '../../../../shapes'
import LoadingIcon from '../../../../components/LoadingIcon'
import OrganizationsCreateDialog from '../OrganizationsCreateDialog'

const styles = theme => ({
  container: {
    padding: '1em',
    [theme.breakpoints.up(1000 + theme.spacing(3 * 2))]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  card: {
    height: 150
  },
  cardContent: {
    height: '100%'
  },
  actionArea: {
    width: '100%',
    height: '100%',
    verticalAlign: 'top'
  },
  createIcon: {
    float: 'left'
  },
  createText: {
    fontSize: '1rem'
  }
})

class OrganizationsList extends React.Component {
  handleCreateClick = () => {
    this.props.openCreateOrganizationDialog()
  }

  handleDialogClose = () => {
    this.props.closeCreateOrganizationDialog()
  }

  render() {
    const {
      createDialog,
      organizations,
      classes,
      updateCreateOrganizationDialogData,
      createOrganization
    } = this.props
    if (!isLoaded(organizations)) {
      return <LoadingIcon />
    }

    return (
      <Grid
        container
        className={classes.container}
        spacing={3}
        data-cy="organizations-list"
      >
        {featureToggles.isFeatureEnabled('organizationsManagement') && (
          <Grid item key="new" sm={4} xs={12}>
            <Card className={classes.card} data-cy="organization-create-button">
              <CardActionArea
                className={classes.actionArea}
                onClick={this.handleCreateClick}
              >
                <CardContent className={classes.cardContent}>
                  <CreateNewFolder className={classes.createIcon} />
                  <Typography variant="button" className={classes.createText}>
                    <FormattedMessage id="organizations.create" />
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )}
        {organizations.map(organization => (
          <Grid item key={organization.id} sm={4} xs={12}>
            <Card className={classes.card}>
              <CardActionArea
                className={classes.actionArea}
                component={Link}
                to={`/organizations/${organization.id}`}
              >
                <CardContent className={classes.cardContent}>
                  <Typography variant="h6">{organization.id}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        <OrganizationsCreateDialog
          open={createDialog.open}
          data={createDialog.data}
          submitted={createDialog.submitted}
          updateData={updateCreateOrganizationDialogData}
          onClose={this.handleDialogClose}
          onSubmit={createOrganization}
        />
      </Grid>
    )
  }
}

OrganizationsList.propTypes = {
  createDialog: PropTypes.shape({
    open: PropTypes.bool,
    submitted: PropTypes.bool,
    data: PropTypes.object
  }).isRequired,
  organizations: PropTypes.arrayOf(organization),
  classes: PropTypes.object.isRequired,
  openCreateOrganizationDialog: PropTypes.func.isRequired,
  closeCreateOrganizationDialog: PropTypes.func.isRequired,
  updateCreateOrganizationDialogData: PropTypes.func.isRequired,
  createOrganization: PropTypes.func.isRequired
}

export default withStyles(styles)(OrganizationsList)
