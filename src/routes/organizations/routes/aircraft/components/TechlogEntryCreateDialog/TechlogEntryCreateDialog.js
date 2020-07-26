import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'
import AttachmentIcon from '@material-ui/icons/Attachment'
import {
  intl as intlShape,
  organization as organizationShape
} from '../../../../../../shapes'
import Select from '../../../../../../components/Select'
import humanFileSize from '../../../../../../util/humanFileSize'

const styles = theme => ({
  root: {
    overflow: 'visible'
  },
  buttonIcon: {
    marginRight: 5
  },
  removeAttachmentButton: {
    marginLeft: '0.3em'
  },
  attachments: {
    marginTop: '0.5em'
  },
  attachmentIcon: {
    verticalAlign: 'middle',
    height: '0.85em',
    marginRight: '0.1em'
  },
  addAttachmentButton: {
    marginTop: '0.5em'
  },
  disabledText: {
    color: theme.palette.text.disabled
  }
})

class TechlogEntryCreateDialog extends React.Component {
  handleChange = name => e => {
    this.updateData(name, e.target.value)
  }

  handleSelectChange = name => value => {
    this.updateData(name, value)
  }

  handleUploadChange = e => {
    const newAttachments = [...this.props.data.attachments]
    for (const file of e.target.files) {
      if (
        !newAttachments.find(
          attachment =>
            attachment.name === file.name && attachment.size === file.size
        )
      ) {
        newAttachments.push(file)
      }
    }
    this.updateData('attachments', newAttachments)
    e.target.value = null
  }

  removeAttachment = index => () => {
    const attachments = this.props.data.attachments
    const newAttachments = attachments
      .slice(0, index)
      .concat(attachments.slice(index + 1, attachments.length))
    this.updateData('attachments', newAttachments)
  }

  updateData = (name, value) => {
    this.props.updateData({
      [name]: value
    })
  }

  handleClose = () => {
    const { onClose, submitting } = this.props
    if (submitting !== true && onClose) {
      onClose()
    }
  }

  handleSubmit = e => {
    const { onSubmit, organization, aircraftId, data, submitting } = this.props

    e.preventDefault()
    if (submitting !== true && onSubmit) {
      onSubmit(organization.id, aircraftId, data)
    }
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const { statusOptions, submitting, classes, onClose } = this.props
    return (
      <Dialog
        onClose={this.handleClose}
        data-cy="techlog-entry-create-dialog"
        classes={{ paperScrollPaper: classes.root }}
        open
        fullWidth
      >
        <DialogTitle>
          <FormattedMessage id="aircraft.techlog.create.dialog.title" />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent className={classes.root}>
            {this.renderMultilineTextField('description', true)}
            {this.renderSelect('status', statusOptions, true)}
            {this.renderAttachments()}
            {this.renderAddAttachmentButton()}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={submitting}>
              <FormattedMessage id="aircraft.techlog.create.dialog.buttons.cancel" />
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              data-cy="create-button"
              disabled={submitting}
            >
              {submitting && (
                <CircularProgress size={16} className={classes.buttonIcon} />
              )}
              <FormattedMessage id="aircraft.techlog.create.dialog.buttons.create" />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }

  renderAttachments() {
    const { data, submitting, classes } = this.props

    if (data.attachments.length === 0) {
      return null
    }

    return (
      <div
        className={classNames(
          classes.attachments,
          submitting && classes.disabledText
        )}
      >
        {data.attachments.map((attachment, index) => (
          <div key={`${attachment.name}-${attachment.size}`}>
            <AttachmentIcon className={classes.attachmentIcon} />
            <span>
              {attachment.name} ({humanFileSize(attachment.size)})
            </span>
            <IconButton
              size="small"
              className={classes.removeAttachmentButton}
              onClick={this.removeAttachment(index)}
              disabled={submitting}
            >
              <ClearIcon />
            </IconButton>
          </div>
        ))}
      </div>
    )
  }

  renderAddAttachmentButton() {
    const { submitting, classes } = this.props
    return (
      <div className={classes.addAttachmentButton}>
        <input
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={this.handleUploadChange}
          multiple
        />
        <label htmlFor="raised-button-file">
          <Button
            component="span"
            onClick={this.handleUploadButtonClick}
            disabled={submitting}
          >
            <AttachmentIcon size={16} className={classes.buttonIcon} />
            <FormattedMessage id="aircraft.techlog.create.dialog.addattachment" />
          </Button>
        </label>
      </div>
    )
  }

  renderMultilineTextField(name, required) {
    return (
      <TextField
        label={this.msg(`aircraft.techlog.create.dialog.${name.toLowerCase()}`)}
        value={this.props.data[name]}
        onChange={this.handleChange(name)}
        data-cy={`${name}-field`}
        margin="dense"
        multiline
        fullWidth
        disabled={this.props.submitting}
        required={required}
        rows={5}
      />
    )
  }

  renderSelect(name, options, required) {
    return (
      <Select
        label={this.msg(`aircraft.techlog.create.dialog.${name}`)}
        type="text"
        fullWidth
        required={required}
        value={this.props.data[name]}
        onChange={this.handleSelectChange(name)}
        data-cy={`${name}-field`}
        disabled={this.props.submitting}
        options={options}
      />
    )
  }
}

TechlogEntryCreateDialog.propTypes = {
  organization: organizationShape.isRequired,
  aircraftId: PropTypes.string.isRequired,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  data: PropTypes.shape({
    description: PropTypes.string.isRequired,
    status: PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }),
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired
      })
    ).isRequired
  }).isRequired,
  submitting: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  intl: intlShape,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(TechlogEntryCreateDialog))
