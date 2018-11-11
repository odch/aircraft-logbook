import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import isLoaded from '../../../../../../util/isLoaded'
import { organization as organizationShape } from '../../../../../../shapes'
import LoadingIcon from '../../../../../../components/LoadingIcon'

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
    this.props.selectOrganization(this.props.organizationId)
  }

  render() {
    const { organization, classes } = this.props

    if (!isLoaded(organization)) {
      return <LoadingIcon />
    }

    if (!organization) {
      return <Redirect to="/" />
    }

    return (
      <div className={classes.container}>
        <Typography variant="title">{organization.id}</Typography>
      </div>
    )
  }
}

OrganizationDetail.propTypes = {
  organizationId: PropTypes.string.isRequired,
  organization: organizationShape,
  classes: PropTypes.object.isRequired,
  selectOrganization: PropTypes.func.isRequired
}

export default withStyles(styles)(OrganizationDetail)
