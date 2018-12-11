import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import DeleteIcon from '@material-ui/icons/Delete'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
})

const DeleteButton = ({
  classes,
  onClick,
  label,
  type,
  color,
  variant,
  disabled,
  inProgress,
  ...other
}) => (
  <Button
    {...other}
    className={classes.button}
    onClick={onClick}
    type={type}
    color={color}
    variant={variant}
    disabled={disabled}
  >
    {inProgress ? (
      <CircularProgress size={16} className={classes.leftIcon} />
    ) : (
      <DeleteIcon className={classes.leftIcon} />
    )}
    {label}
  </Button>
)

DeleteButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  inProgress: PropTypes.bool
}

export default withStyles(styles)(DeleteButton)
