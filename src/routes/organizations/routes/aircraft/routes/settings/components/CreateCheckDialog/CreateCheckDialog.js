import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { intl as intlShape } from '../../../../../../../../shapes'
import Select from '../../../../../../../../components/Select'
import IntegerField from '../../../../../../../../components/IntegerField'

const styles = {
  root: { overflow: 'visible' },
  loadingIndicator: {
    marginRight: 5
  }
}

class CreateCheckDialog extends React.Component {
  handleTextChange = name => e => {
    this.updateData(name, e.target.value)
  }

  handleDateChange = name => momentDate => {
    const newValue = momentDate ? momentDate.toDate() : null
    this.updateData(name, newValue)
  }

  handleSelectChange = name => value => {
    this.updateData(name, value)
  }

  handleIntegerChange = name => value => {
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
    const {
      onSubmit,
      organizationId,
      aircraftId,
      data,
      submitting
    } = this.props

    e.preventDefault()
    if (submitting !== true && onSubmit) {
      onSubmit(organizationId, aircraftId, data)
    }
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const { data, counters, submitting, valid, classes } = this.props
    return (
      <Dialog
        classes={{ paperScrollPaper: classes.root }}
        onClose={this.handleClose}
        data-cy="check-create-dialog"
        open
      >
        <DialogTitle>
          <FormattedMessage id="aircraft.settings.check.create.dialog.title" />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent className={classes.root}>
            {this.renderTextField('description', false, true)}
            {this.renderDatePicker('dateLimit')}
            {this.renderSelect('counterReference', counters)}
            {this.renderIntegerField(
              'counterLimit',
              data['counterReference'] === null
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} disabled={submitting}>
              <FormattedMessage id="aircraft.settings.check.create.dialog.buttons.cancel" />
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              data-cy="create-button"
              disabled={submitting || !valid}
            >
              {submitting && (
                <CircularProgress
                  size={16}
                  className={classes.loadingIndicator}
                />
              )}
              <FormattedMessage id="aircraft.settings.check.create.dialog.buttons.create" />
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
        label={this.msg(`aircraft.settings.check.create.dialog.${name}`)}
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

  renderDatePicker(name, onChange = this.handleDateChange(name)) {
    return (
      <KeyboardDatePicker
        label={this.msg(
          `aircraft.settings.check.create.dialog.${name.toLowerCase()}`
        )}
        value={this.props.data[name]}
        onChange={onChange}
        format="L"
        data-cy={`${name}-field`}
        margin="normal"
        fullWidth
        autoOk
        clearable
        disabled={this.props.submitting}
      />
    )
  }

  renderIntegerField(name, disabled) {
    return (
      <IntegerField
        label={this.msg(
          `aircraft.settings.check.create.dialog.${name.toLowerCase()}`
        )}
        value={this.props.data[name]}
        onChange={this.handleIntegerChange(name)}
        cy={`${name}-field`}
        margin="normal"
        fullWidth
        disabled={this.props.submitting || disabled}
      />
    )
  }

  renderSelect(name, options) {
    return (
      <Select
        label={this.msg(
          `aircraft.settings.check.create.dialog.${name.toLowerCase()}`
        )}
        value={this.props.data[name]}
        onChange={this.handleSelectChange(name)}
        options={options}
        data-cy={`${name}-field`}
        margin="normal"
        disabled={this.props.submitting}
      />
    )
  }
}

CreateCheckDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    description: PropTypes.string.isRequired,
    counterDate: PropTypes.object,
    counterReference: PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }),
    counterLimit: PropTypes.number
  }).isRequired,
  counters: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  submitting: PropTypes.bool,
  valid: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  intl: intlShape,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(CreateCheckDialog))
