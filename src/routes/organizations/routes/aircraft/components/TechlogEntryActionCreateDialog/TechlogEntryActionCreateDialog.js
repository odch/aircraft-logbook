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
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { withStyles } from '@material-ui/core/styles'
import {
  intl as intlShape,
  organization as organizationShape
} from '../../../../../../shapes'
import Select from '../../../../../../components/Select'
import Attachments from '../Attachments'
import FileButton from '../FileButton'

const styles = {
  root: {
    overflow: 'visible'
  },
  loadingIndicator: {
    marginRight: 5
  },
  attachments: {
    marginTop: '0.5em'
  },
  addAttachmentButton: {
    marginTop: '0.5em'
  }
}

class TechlogEntryActionCreateDialog extends React.Component {
  handleChange = name => e => {
    this.updateData(name, e.target.value)
  }

  handleSelectChange = name => value => {
    this.updateData(name, value)
  }

  handleCheckboxChange = name => e => {
    this.updateData(name, e.target.checked)
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
    const {
      onSubmit,
      organization,
      aircraftId,
      techlogEntryId,
      data,
      submitting
    } = this.props

    e.preventDefault()
    if (submitting !== true && onSubmit) {
      onSubmit(organization.id, aircraftId, techlogEntryId, data)
    }
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const {
      statusOptions,
      submitting,
      aircraftSettings: { techlogSignatureEnabled },
      classes,
      onClose
    } = this.props
    return (
      <Dialog
        onClose={this.handleClose}
        data-cy="techlog-entry-action-create-dialog"
        classes={{ paperScrollPaper: classes.root }}
        open
        fullWidth
      >
        <DialogTitle>
          <FormattedMessage id="aircraft.techlog.action.create.dialog.title" />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent className={classes.root}>
            {this.renderMultilineTextField('description', true)}
            {this.renderSelect('status', statusOptions, true)}
            {techlogSignatureEnabled && this.renderCheckbox('signature')}
            <Attachments
              attachments={this.props.data.attachments}
              disabled={submitting}
              className={classes.attachments}
              onRemoveClick={this.removeAttachment}
            />
            <FileButton
              label={this.msg(
                'aircraft.techlog.action.create.dialog.addattachment'
              )}
              disabled={submitting}
              className={classes.addAttachmentButton}
              onSelect={this.handleFileSelect}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={submitting}>
              <FormattedMessage id="aircraft.techlog.action.create.dialog.buttons.cancel" />
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              data-cy="create-button"
              disabled={submitting}
            >
              {submitting && (
                <CircularProgress
                  size={16}
                  className={classes.loadingIndicator}
                />
              )}
              <FormattedMessage id="aircraft.techlog.action.create.dialog.buttons.create" />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }

  renderMultilineTextField(name, required) {
    return (
      <TextField
        label={this.msg(
          `aircraft.techlog.action.create.dialog.${name.toLowerCase()}`
        )}
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

  renderCheckbox(name) {
    return (
      <FormControlLabel
        value={name}
        control={
          <Checkbox
            color="primary"
            checked={this.props.data[name] === true}
            onChange={this.handleCheckboxChange(name)}
          />
        }
        label={this.msg(`aircraft.techlog.action.create.dialog.${name}`)}
        labelPlacement="end"
        disabled={this.props.submitting}
      />
    )
  }

  renderSelect(name, options, required) {
    return (
      <Select
        label={this.msg(`aircraft.techlog.action.create.dialog.${name}`)}
        type="text"
        fullWidth
        required={required}
        value={this.props.data[name]}
        onChange={this.handleSelectChange(name)}
        data-cy={`${name}-field`}
        disabled={this.props.submitting}
        options={options}
        clearable={false}
      />
    )
  }
}

TechlogEntryActionCreateDialog.propTypes = {
  organization: organizationShape.isRequired,
  aircraftId: PropTypes.string.isRequired,
  techlogEntryId: PropTypes.string.isRequired,
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
  aircraftSettings: PropTypes.shape({
    techlogSignatureEnabled: PropTypes.bool
  }).isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  intl: intlShape,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(TechlogEntryActionCreateDialog))
