import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import {
  organization as organizationShape,
  aircraft as aircraftShape
} from '../../../../../../shapes'

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
  }
}

class AircraftList extends React.Component {
  render() {
    const { organization, aircrafts, classes } = this.props
    return (
      <Grid container spacing={24} data-cy="aircraft-list">
        {aircrafts.map(aircraft => (
          <Grid item key={aircraft.id} sm={4} xs={12}>
            <Card className={classes.card}>
              <CardActionArea
                className={classes.actionArea}
                component={Link}
                to={`/organizations/${organization.id}/aircrafts/${aircraft.id}`}
              >
                <CardContent className={classes.cardContent}>
                  <Typography variant="title">
                    {aircraft.registration}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }
}

AircraftList.propTypes = {
  organization: organizationShape,
  aircrafts: PropTypes.arrayOf(aircraftShape),
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AircraftList)
