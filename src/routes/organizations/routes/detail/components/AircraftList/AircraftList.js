import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import AddBoxIcon from '@material-ui/icons/AddBox'
import {
  organization as organizationShape,
  aircraft as aircraftShape
} from '../../../../../../shapes'
import AircraftCreateDialog from '../../containers/AircraftCreateDialogContainer'

const styles = {
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
}

class AircraftList extends React.Component {
  isOrganizationManager = () =>
    this.props.organization.roles.includes('manager')

  handleCreateClick = () => {
    this.props.openCreateAircraftDialog()
  }

  render() {
    const {
      organization,
      aircrafts,
      createAircraftDialogOpen,
      classes
    } = this.props
    return (
      <Grid container spacing={3} data-cy="aircraft-list">
        {this.isOrganizationManager() && (
          <Grid item key="new" sm={4} xs={12}>
            <Card className={classes.card} data-cy="aircraft-create-button">
              <CardActionArea
                className={classes.actionArea}
                onClick={this.handleCreateClick}
              >
                <CardContent className={classes.cardContent}>
                  <AddBoxIcon className={classes.createIcon} />
                  <Typography variant="button" className={classes.createText}>
                    <FormattedMessage id="aircrafts.create" />
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )}
        {aircrafts.map(aircraft => (
          <Grid item key={aircraft.id} sm={4} xs={12}>
            <Card className={classes.card}>
              <CardActionArea
                className={classes.actionArea}
                component={Link}
                to={`/organizations/${organization.id}/aircrafts/${aircraft.id}`}
              >
                <CardContent className={classes.cardContent}>
                  <Typography variant="h6">{aircraft.registration}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        {createAircraftDialogOpen && (
          <AircraftCreateDialog organizationId={organization.id} />
        )}
      </Grid>
    )
  }
}

AircraftList.propTypes = {
  organization: organizationShape,
  aircrafts: PropTypes.arrayOf(aircraftShape),
  createAircraftDialogOpen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  openCreateAircraftDialog: PropTypes.func.isRequired
}

export default withStyles(styles)(AircraftList)
