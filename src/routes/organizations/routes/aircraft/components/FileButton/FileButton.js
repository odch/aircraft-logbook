import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import AttachmentIcon from '@material-ui/icons/Attachment'

const styles = {
  buttonIcon: {
    marginRight: 5
  }
}

const onChange = onSelect => e => {
  if (onSelect) {
    onSelect(e.target.files)
  }
  e.target.value = null
}

const FileButton = ({ label, disabled, className, classes, onSelect }) => (
  <div className={className}>
    <input
      style={{ display: 'none' }}
      id="raised-button-file"
      type="file"
      onChange={onChange(onSelect)}
      multiple
    />
    <label htmlFor="raised-button-file">
      <Button component="span" disabled={disabled}>
        <AttachmentIcon size={16} className={classes.buttonIcon} />
        {label}
      </Button>
    </label>
  </div>
)

FileButton.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  onSelect: PropTypes.func,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FileButton)
