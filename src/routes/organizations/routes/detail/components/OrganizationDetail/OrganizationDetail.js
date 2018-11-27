import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import isLoaded from '../../../../../../util/isLoaded'
import {
  organization as organizationShape,
  aircraft as aircraftShape
} from '../../../../../../shapes'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import AircraftList from '../AircraftList'

const styles = theme => ({
  container: {
    padding: '1em',
    [theme.breakpoints.up(1000 + theme.spacing.unit * 3 * 2)]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }
})

class OrganizationDetail extends React.Component {
  componentDidMount() {
    if (this.props.organization) {
      this.props.fetchAircrafts(this.props.organization.id)
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.organization &&
      (!prevProps.organization ||
        prevProps.organization.id !== this.props.organization.id)
    ) {
      this.props.fetchAircrafts(this.props.organization.id)
    }
  }

  render() {
    const { organization, aircrafts, classes } = this.props

    if (!isLoaded(organization) || !isLoaded(aircrafts)) {
      return <LoadingIcon />
    }

    if (!organization) {
      return <Redirect to="/" />
    }

    return (
      <div className={classes.container}>
        <Typography variant="title">{organization.id}</Typography>
        <AircraftList organization={organization} aircrafts={aircrafts} />
      </div>
    )
  }
}

OrganizationDetail.propTypes = {
  organization: organizationShape,
  aircrafts: PropTypes.arrayOf(aircraftShape),
  classes: PropTypes.object.isRequired,
  fetchAircrafts: PropTypes.func.isRequired
}

export default withStyles(styles)(OrganizationDetail)
