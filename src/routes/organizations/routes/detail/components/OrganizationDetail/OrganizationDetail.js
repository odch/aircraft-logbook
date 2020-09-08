import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
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
    [theme.breakpoints.up(1000 + theme.spacing(3 * 2))]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  notFoundMessage: {
    textAlign: 'center',
    marginTop: '1em'
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
    const {
      organizationId,
      userEmail,
      organization,
      aircrafts,
      classes
    } = this.props

    if (!isLoaded(organization)) {
      return <LoadingIcon />
    }

    if (!organization) {
      return this.renderContent(
        <div className={classes.notFoundMessage}>
          <FormattedMessage
            id="organization.notfound"
            values={{
              organizationId,
              userEmail,
              strong: chunks => <strong>{chunks}</strong>
            }}
          />
        </div>
      )
    }

    if (!isLoaded(aircrafts)) {
      return <LoadingIcon />
    }

    return this.renderContent(
      <>
        <Typography variant="h4" gutterBottom>
          {organizationId}
        </Typography>
        <AircraftList organization={organization} aircrafts={aircrafts} />
      </>
    )
  }

  renderContent(content) {
    const { classes } = this.props
    return <div className={classes.container}>{content}</div>
  }
}

OrganizationDetail.propTypes = {
  organizationId: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  organization: organizationShape,
  aircrafts: PropTypes.arrayOf(aircraftShape),
  classes: PropTypes.object.isRequired,
  fetchAircrafts: PropTypes.func.isRequired
}

export default withStyles(styles)(OrganizationDetail)
