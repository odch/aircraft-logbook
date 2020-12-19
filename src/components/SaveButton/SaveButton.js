import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = {
  inProgressIndicator: {
    marginRight: 5
  }
}

const SaveButton = ({
  onClick,
  label,
  type,
  color,
  variant,
  disabled,
  inProgress,
  classes,
  ...other
}) => (
  <Button
    {...other}
    onClick={onClick}
    type={type}
    color={color}
    variant={variant}
    disabled={disabled}
  >
    {inProgress && (
      <CircularProgress size={16} className={classes.inProgressIndicator} />
    )}
    {label}
  </Button>
)

SaveButton.defaultProps = {
  type: 'submit',
  color: 'primary',
  variant: 'contained'
}

SaveButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  inProgress: PropTypes.bool,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SaveButton)
