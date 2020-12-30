import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import CircularProgress from '@material-ui/core/CircularProgress'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItem from '@material-ui/core/ListItem'

const styles = {
  loadingIndicator: {
    verticalAlign: 'middle',
    height: '0.85em',
    marginRight: '0.7em'
  }
}

const SettingSelect = ({
  label,
  value,
  options,
  submitting,
  onChange,
  classes
}) => (
  <ListItem disableGutters>
    <ListItemText primary={label} />
    <ListItemSecondaryAction>
      {submitting && (
        <CircularProgress size={16} className={classes.loadingIndicator} />
      )}
      <Select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={submitting}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </ListItemSecondaryAction>
  </ListItem>
)

SettingSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  submitting: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default withStyles(styles)(SettingSelect)
