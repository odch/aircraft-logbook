import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import {
  intl as intlShape,
  organization as organizationShape
} from '../../../../../../shapes'
import Select from '../../../../../../components/Select'
import FileButton from '../FileButton'
import Attachments from '../Attachments'

const styles = {
  root: {
    overflow: 'visible'
  },
  buttonIcon: {
    marginRight: 5
  },
  attachments: {
    marginTop: '0.5em'
  },
  addAttachmentButton: {
    marginTop: '0.5em'
  }
}

class TechlogEntryCreateDialog extends React.Component {
  handleChange = name => e => {
    this.updateData(name, e.target.value)
  }

  handleSelectChange = name => value => {
    this.updateData(name, value)
  }

  handleFileSelect = files => {
    const newAttachments = [...this.props.data.attachments]
    for (const file of files) {
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
  }

  removeAttachment = (attachment, index) => {
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
            <Attachments
              attachments={this.props.data.attachments}
              disabled={submitting}
              className={classes.attachments}
              onRemoveClick={this.removeAttachment}
            />
            <FileButton
              label={this.msg('aircraft.techlog.create.dialog.addattachment')}
              disabled={submitting}
              className={classes.addAttachmentButton}
              onSelect={this.handleFileSelect}
            />
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
