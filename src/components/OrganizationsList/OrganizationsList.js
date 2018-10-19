import React from 'react'
import PropTypes from 'prop-types'
import { isLoaded } from 'react-redux-firebase'
import { FormattedMessage } from 'react-intl'
import { organization } from '../../shapes'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CreateNewFolder from '@material-ui/icons/CreateNewFolder'
import LoadingIcon from '../LoadingIcon'
import OrganizationsCreateDialog from '../OrganizationsCreateDialog'

const styles = theme => ({
  container: {
    padding: '1em',
    [theme.breakpoints.up(1000 + theme.spacing.unit * 3 * 2)]: {
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
    fontSize: '1rem',
    marginLeft: '2em'
  }
})

class OrganizationsList extends React.Component {
  componentDidMount() {
    this.props.watchOrganizations()
  }

  componentWillUnmount() {
    this.props.unwatchOrganizations()
  }

  handleCreateClick = () => {
    this.props.openCreateOrganizationDialog()
  }

  handleDialogClose = () => {
    this.props.closeCreateOrganizationDialog()
  }

  render() {
    const { organizations, classes } = this.props
    if (!isLoaded(organizations)) {
      return <LoadingIcon />
    }

    return (
      <Grid
        container
        className={classes.container}
        spacing={24}
        data-cy="organizations-list"
      >
        <Grid item key="new" sm={4} xs={12}>
          <Card className={classes.card}>
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
        {organizations.map(organization => (
          <Grid item key={organization.id} sm={4} xs={12}>
            <Card className={classes.card}>
              <CardActionArea className={classes.actionArea}>
                <CardContent className={classes.cardContent}>
                  <Typography variant="title">{organization.id}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        <OrganizationsCreateDialog
          open={this.props.createDialogOpen}
          data={this.props.createDialogData}
          updateData={this.props.updateCreateOrganizationDialogData}
          onClose={this.handleDialogClose}
          onSubmit={this.props.createOrganization}
        />
      </Grid>
    )
  }
}

OrganizationsList.propTypes = {
  createDialogOpen: PropTypes.bool,
  createDialogData: PropTypes.object,
  organizations: PropTypes.arrayOf(organization),
  classes: PropTypes.object.isRequired,
  openCreateOrganizationDialog: PropTypes.func.isRequired,
  closeCreateOrganizationDialog: PropTypes.func.isRequired,
  updateCreateOrganizationDialogData: PropTypes.func.isRequired,
  watchOrganizations: PropTypes.func.isRequired,
  unwatchOrganizations: PropTypes.func.isRequired,
  createOrganization: PropTypes.func.isRequired
}

export default withStyles(styles)(OrganizationsList)
