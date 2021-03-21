import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import ErrorIcon from '@material-ui/icons/Error'
import Typography from '@material-ui/core/Typography'

const styles = {
  wrapper: {
    borderRadius: 5,
    backgroundColor: '#fadebc',
    padding: '1em',
    marginBottom: '1em'
  },
  icon: {
    verticalAlign: 'bottom',
    marginRight: 5
  }
}

const ExpiredNotification = ({ classes }) => (
  <Typography className={classes.wrapper}>
    <ErrorIcon className={classes.icon} />
    <FormattedMessage id="organization.expired" />
  </Typography>
)

ExpiredNotification.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ExpiredNotification)
