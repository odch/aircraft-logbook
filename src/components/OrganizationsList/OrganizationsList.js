import React from 'react'
import PropTypes from 'prop-types'
import { isLoaded } from 'react-redux-firebase'
import LoadingIcon from '../LoadingIcon'
import { organization } from '../../shapes'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

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
  }
})

class OrganizationsList extends React.Component {
  componentDidMount() {
    this.props.loadOrganizations()
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
      </Grid>
    )
  }
}

OrganizationsList.propTypes = {
  organizations: PropTypes.arrayOf(organization),
  classes: PropTypes.object.isRequired,
  loadOrganizations: PropTypes.func.isRequired
}

export default withStyles(styles)(OrganizationsList)
