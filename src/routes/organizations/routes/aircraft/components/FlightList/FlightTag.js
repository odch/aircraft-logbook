import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  tag: {
    textTransform: 'uppercase',
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.typography.pxToRem(5),
    padding: theme.typography.pxToRem(5),
    display: 'inline-block',
    verticalAlign: 'top',
    fontSize: '0.8em'
  }
})

const FlightTag = ({ children, classes, className }) => (
  <Typography component="span" className={classNames(classes.tag, className)}>
    {children}
  </Typography>
)

FlightTag.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
}

export default withStyles(styles)(FlightTag)
