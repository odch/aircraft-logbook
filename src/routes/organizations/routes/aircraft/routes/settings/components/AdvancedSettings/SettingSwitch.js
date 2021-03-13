import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import CircularProgress from '@material-ui/core/CircularProgress'
import Switch from '@material-ui/core/Switch'
import ListItem from '@material-ui/core/ListItem'
import Tooltip from '@material-ui/core/Tooltip'

const styles = {
  loadingIndicator: {
    verticalAlign: 'middle',
    height: '0.85em',
    marginRight: '0.1em'
  }
}

const SettingSwitch = ({
  label,
  checked,
  submitting,
  disabled,
  tooltip,
  onChange,
  classes
}) => (
  <ListItem disableGutters>
    <ListItemText primary={label} />
    <ListItemSecondaryAction>
      {submitting && (
        <CircularProgress size={16} className={classes.loadingIndicator} />
      )}
      <Tooltip
        title={tooltip || ''}
        disableFocusListener={!tooltip}
        disableHoverListener={!tooltip}
        disableTouchListener={!tooltip}
      >
        <span>
          <Switch
            edge="end"
            onChange={e => onChange(e.target.checked)}
            checked={checked}
            disabled={disabled || submitting}
          />
        </span>
      </Tooltip>
    </ListItemSecondaryAction>
  </ListItem>
)

SettingSwitch.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  submitting: PropTypes.bool,
  disabled: PropTypes.bool,
  tooltip: PropTypes.string,
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default withStyles(styles)(SettingSwitch)
