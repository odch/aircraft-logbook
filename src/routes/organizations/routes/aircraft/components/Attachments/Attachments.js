import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'
import AttachmentIcon from '@material-ui/icons/Attachment'
import humanFileSize from '../../../../../../util/humanFileSize'

const styles = theme => ({
  removeAttachmentButton: {
    marginLeft: '0.3em'
  },
  attachmentIcon: {
    verticalAlign: 'middle',
    height: '0.85em',
    marginRight: '0.1em'
  },
  disabledText: {
    color: theme.palette.text.disabled
  }
})

const Attachments = ({
  attachments,
  disabled,
  className,
  classes,
  onRemoveClick
}) => {
  if (!attachments || attachments.length === 0) {
    return null
  }
  return (
    <div className={classNames(className, disabled && classes.disabledText)}>
      {attachments.map((attachment, index) => (
        <div key={`${attachment.name}-${attachment.size}`}>
          <AttachmentIcon className={classes.attachmentIcon} />
          <span>
            {attachment.name} ({humanFileSize(attachment.size)})
          </span>
          <IconButton
            size="small"
            className={classes.removeAttachmentButton}
            onClick={() => {
              if (onRemoveClick) {
                onRemoveClick(attachment, index)
              }
            }}
            disabled={disabled}
          >
            <ClearIcon />
          </IconButton>
        </div>
      ))}
    </div>
  )
}

Attachments.propTypes = {
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired
    })
  ),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onRemoveClick: PropTypes.func,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Attachments)
