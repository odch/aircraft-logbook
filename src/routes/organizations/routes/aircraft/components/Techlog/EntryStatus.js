import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core'
import { isClosed } from '../../../../../../util/techlogStatus'

const styles = theme => ({
  status: {
    textTransform: 'uppercase',
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.typography.pxToRem(5),
    padding: theme.typography.pxToRem(5),
    display: 'inline-block',
    verticalAlign: 'top'
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    color: '#fff'
  },
  closed: {
    backgroundColor: '#81c784'
  },
  small: {
    fontSize: '0.8em'
  }
})

const EntryStatus = ({ id, small, classes }) => (
  <Typography
    component="span"
    className={classNames(
      classes.status,
      id === 'not_airworthy' && classes.error,
      isClosed(id) && classes.closed,
      small && classes.small
    )}
  >
    <FormattedMessage id={`techlog.entry.status.${id}`} />
  </Typography>
)

EntryStatus.propTypes = {
  id: PropTypes.string.isRequired,
  small: PropTypes.bool,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EntryStatus)
