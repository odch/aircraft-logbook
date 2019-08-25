import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import CircularProgress from '@material-ui/core/CircularProgress'

const DeleteButton = ({
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
    onClick={onClick}
    type={type}
    color={color}
    variant={variant}
    disabled={disabled}
  >
    {inProgress ? <CircularProgress size={16} /> : <DeleteIcon />}
    {label}
  </Button>
)

DeleteButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  inProgress: PropTypes.bool
}

export default DeleteButton
