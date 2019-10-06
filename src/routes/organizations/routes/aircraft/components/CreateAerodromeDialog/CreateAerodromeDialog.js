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
import moment from 'moment-timezone'
import { intl as intlShape } from '../../../../../../shapes'
import Select from '../../../../../../components/Select'

const styles = {
  root: { overflow: 'visible' },
  loadingIndicator: {
    marginRight: 5
  }
}

const TIMEZONE_OPTIONS = moment.tz
  .names()
  .filter(name => name.includes('/'))
  .map(name => ({
    value: name,
    label: name
  }))

class CreateAerodromeDialog extends React.Component {
  handleTextChange = name => e => {
    this.updateData(name, e.target.value)
  }

  handleIdentificationChange = e => {
    this.updateData('identification', e.target.value.toUpperCase())
  }

  handleSelectChange = name => value => {
    this.updateData(name, value)
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
    const { onSubmit, organizationId, fieldName, data, submitting } = this.props

    e.preventDefault()
    if (submitting !== true && onSubmit) {
      onSubmit(organizationId, fieldName, data)
    }
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const { submitting, classes, onClose } = this.props
    return (
      <Dialog
        classes={{ paperScrollPaper: classes.root }}
        onClose={this.handleClose}
        data-cy="aerodrome-create-dialog"
        open
      >
        <DialogTitle>
          <FormattedMessage id="organization.aerodrome.create.dialog.title" />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent className={classes.root}>
            {this.renderTextField(
              'identification',
              true,
              true,
              this.handleIdentificationChange
            )}
            {this.renderTextField('name', false, true)}
            {this.renderSelect('timezone', TIMEZONE_OPTIONS, true)}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={submitting}>
              <FormattedMessage id="organization.aerodrome.create.dialog.buttons.cancel" />
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
              <FormattedMessage id="organization.aerodrome.create.dialog.buttons.create" />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }

  renderTextField(
    name,
    autoFocus,
    required,
    onChange = this.handleTextChange(name)
  ) {
    return (
      <TextField
        label={this.msg(`organization.aerodrome.create.dialog.${name}`)}
        type="text"
        fullWidth
        required={required}
        value={this.props.data[name]}
        onChange={onChange}
        data-cy={`${name}-field`}
        disabled={this.props.submitting}
        autoFocus={autoFocus}
      />
    )
  }

  renderSelect(name, options, required) {
    return (
      <Select
        label={this.msg(`organization.aerodrome.create.dialog.${name}`)}
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

CreateAerodromeDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  data: PropTypes.shape({
    identification: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    timezone: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    })
  }).isRequired,
  submitting: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  intl: intlShape,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(CreateAerodromeDialog))
