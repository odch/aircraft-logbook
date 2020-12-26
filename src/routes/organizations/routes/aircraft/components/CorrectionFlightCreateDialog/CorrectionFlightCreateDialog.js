import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import _get from 'lodash.get'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers'
import Select from '../../../../../../components/Select'
import DecimalField from '../../../../../../components/DecimalField'
import IntegerField from '../../../../../../components/IntegerField'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import SaveButton from '../../../../../../components/SaveButton'
import { intl as intlShape } from '../../../../../../shapes'
import EnterCorrectionsAlert from './EnterCorrectionsAlert'
import CorrectionsConfirmationDialog from './CorrectionsConfirmationDialog'

const styles = theme => ({
  loadingIconContainer: {
    height: 200,
    width: 200
  },
  error: {
    color: theme.palette.error.main
  },
  infoText: {
    marginTop: theme.spacing(0.2) + 'em'
  }
})

class CorrectionFlightCreateDialog extends React.Component {
  handleDateChange = name => momentDate => {
    const newValue = momentDate ? momentDate.format('YYYY-MM-DD') : null
    this.updateData(name, newValue)
  }

  handleTimeChange = name => momentDate => {
    const newValue = momentDate ? momentDate.format('YYYY-MM-DD HH:mm') : null
    this.updateData(name, newValue)
  }

  handleDecimalChange = name => value => {
    this.updateData(name, value)
  }

  handleIntegerChange = name => value => {
    this.updateData(name, value)
  }

  handleMultilineTextChange = name => e => {
    this.updateData(name, e.target.value)
  }

  handleSelectChange = name => value => {
    this.updateData(name, value)
  }

  updateData = (name, value) => {
    this.props.updateData({
      [name]: value
    })
  }

  getValue = (name, defaultValue) => _get(this.props.data, name, defaultValue)

  getErrorMessage = name => {
    const errorKey = _get(this.props.validationErrors, name)
    if (errorKey) {
      const messageKey = `correctionflight.create.dialog.validation.${name}.${errorKey}`.toLowerCase()
      return this.msg(messageKey)
    }
    return null
  }

  handleClose = () => {
    const { onClose, submitting } = this.props

    if (submitting !== true && onClose) {
      onClose()
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    const {
      onSubmit,
      organizationId,
      aircraftId,
      data,
      submitting
    } = this.props
    if (submitting !== true && onSubmit) {
      onSubmit(organizationId, aircraftId, data)
    }
  }

  handleConfirmationSubmit = () => {
    const {
      onSubmit,
      organizationId,
      aircraftId,
      data,
      submitting,
      onCloseCorrectionsConfirmationDialog
    } = this.props
    if (submitting !== true && onSubmit) {
      onCloseCorrectionsConfirmationDialog()
      onSubmit(organizationId, aircraftId, data, true)
    }
  }

  msg = (id, values) => this.props.intl.formatMessage({ id }, values)

  getMinDate = lockDate => {
    if (!lockDate) {
      return undefined
    }
    return lockDate
  }

  render() {
    const { data } = this.props
    return (
      <React.Fragment>
        <Dialog
          onClose={this.handleClose}
          data-cy="create-correction-flight-dialog"
          open
        >
          {data.initialized ? this.renderForm() : this.renderLoadingIcon()}
        </Dialog>
      </React.Fragment>
    )
  }

  renderForm() {
    const {
      submitting,
      classes,
      onClose,
      loadMembers,
      corrections,
      aircraftSettings,
      onCloseEnterCorrectionsAlert,
      onCloseCorrectionsConfirmationDialog
    } = this.props

    return (
      <>
        <DialogTitle>
          <FormattedMessage id={`correctionflight.create.dialog.title`} />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent>
            {this.renderDatePicker(
              'date',
              this.getMinDate(aircraftSettings.lockDate)
            )}
            {this.renderTimePicker('time')}
            {this.renderMemberSelect('pilot', loadMembers)}
            {this.renderMultilineTextField('remarks')}
            <DialogContentText className={classes.infoText}>
              {this.msg('correctionflight.create.dialog.infotext')}
            </DialogContentText>
            {this.renderAerodromeCorrectionSet()}
            {this.renderDecimalCorrectionSet('counters.flightHours')}
            {aircraftSettings.flightTimeCounterEnabled &&
              this.renderDecimalCorrectionSet(
                'counters.flightTimeCounter',
                aircraftSettings.flightTimeCounterFractionDigits
              )}
            {this.renderIntegerCorrectionSet('counters.landings')}
            {aircraftSettings.engineHoursCounterEnabled &&
              this.renderDecimalCorrectionSet(
                'counters.engineHours',
                aircraftSettings.engineHoursCounterFractionDigits
              )}
            {aircraftSettings.engineHoursCounterEnabled &&
              this.renderDecimalCorrectionSet(
                'counters.engineTimeCounter',
                aircraftSettings.engineHoursCounterFractionDigits
              )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary" disabled={submitting}>
              <FormattedMessage id="correctionflight.create.dialog.buttons.cancel" />
            </Button>
            <SaveButton
              label={this.msg('correctionflight.create.dialog.buttons.create')}
              disabled={submitting}
              inProgress={submitting}
            />
          </DialogActions>
        </form>
        {corrections &&
          (Object.keys(corrections).length > 0 ? (
            <CorrectionsConfirmationDialog
              corrections={corrections}
              aircraftSettings={aircraftSettings}
              onClose={onCloseCorrectionsConfirmationDialog}
              onSubmit={this.handleConfirmationSubmit}
            />
          ) : (
            <EnterCorrectionsAlert onClose={onCloseEnterCorrectionsAlert} />
          ))}
      </>
    )
  }

  renderDecimalCorrectionSet(name, fractionDigits) {
    return this.renderCorrectionSet(
      name,
      this.renderDecimalField(`${name}.start`, 'current', true, fractionDigits),
      this.renderDecimalField(`${name}.diff`, 'diff', false, fractionDigits),
      this.renderDecimalField(`${name}.end`, 'after', true, fractionDigits)
    )
  }

  renderIntegerCorrectionSet(name) {
    return this.renderCorrectionSet(
      name,
      this.renderIntegerField(`${name}.start`, 'current', true),
      this.renderIntegerField(`${name}.diff`, 'diff'),
      this.renderIntegerField(`${name}.end`, 'after', true)
    )
  }

  renderCorrectionSet(name, current, correction, after) {
    return (
      <FormControl component="fieldset" margin="normal" fullWidth>
        <FormLabel component="legend">
          <FormattedMessage
            id={`correctionflight.create.dialog.${name.toLowerCase()}`}
          />
        </FormLabel>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            {current}
          </Grid>
          <Grid item xs={12} sm={4}>
            {correction}
          </Grid>
          <Grid item xs={12} sm={4}>
            {after}
          </Grid>
        </Grid>
      </FormControl>
    )
  }

  renderAerodromeCorrectionSet() {
    return (
      <FormControl component="fieldset" margin="normal" fullWidth>
        <FormLabel component="legend">
          <FormattedMessage id={`correctionflight.create.dialog.aerodrome`} />
        </FormLabel>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            {this.renderAerodromeSelect(
              'aerodrome',
              'current',
              this.props.loadAerodromes,
              true
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {this.renderAerodromeSelect(
              'newAerodrome',
              'after',
              this.props.loadAerodromes
            )}
          </Grid>
        </Grid>
      </FormControl>
    )
  }

  renderInFormControl(name, renderFn, helperText, margin) {
    const errorMsg = this.getErrorMessage(name)
    const hasError = !!errorMsg

    const isDisabled = !!this.props.submitting

    return (
      <FormControl
        fullWidth
        margin={margin}
        error={hasError}
        disabled={isDisabled}
      >
        {renderFn(hasError, isDisabled)}
        {hasError && <FormHelperText>{errorMsg}</FormHelperText>}
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    )
  }

  renderMemberSelect(name, loadMembers) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <Select
        label={this.msg(`correctionflight.create.dialog.${name.toLowerCase()}`)}
        value={this.getValue(name)}
        onChange={this.handleSelectChange(name)}
        loadOptions={loadMembers}
        data-cy={`${name}-field`}
        margin="normal"
        error={hasError}
        disabled={isDisabled}
      />
    ))
  }

  renderAerodromeSelect(name, label, loadAerodromes, disabled) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <Select
        label={this.msg(`correctionflight.create.dialog.${label}`)}
        value={this.getValue(name)}
        onChange={this.handleSelectChange(name)}
        loadOptions={loadAerodromes}
        data-cy={`${name}-field`}
        margin="normal"
        error={hasError}
        disabled={disabled || isDisabled}
      />
    ))
  }

  renderDatePicker(name, minDate) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <KeyboardDatePicker
        label={this.msg(`correctionflight.create.dialog.${name.toLowerCase()}`)}
        value={this.getValue(name)}
        onChange={this.handleDateChange(name)}
        format="DD.MM.YYYY"
        data-cy={`${name}-field`}
        margin="normal"
        fullWidth
        autoOk
        clearable
        invalidDateMessage={this.msg(
          'correctionflight.create.dialog.dateinvalid'
        )}
        error={hasError}
        disabled={isDisabled}
        minDate={minDate}
      />
    ))
  }

  renderTimePicker(name, disabled) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <KeyboardTimePicker
        ampm={false}
        label={this.msg(`correctionflight.create.dialog.${name.toLowerCase()}`)}
        value={this.getValue(name)}
        onChange={this.handleTimeChange(name)}
        data-cy={`${name}-field`}
        margin="normal"
        fullWidth
        autoOk
        clearable
        invalidDateMessage={this.msg(
          'correctionflight.create.dialog.timeinvalid'
        )}
        error={hasError}
        disabled={disabled || isDisabled}
      />
    ))
  }

  renderDecimalField(name, label, disabled, fractionDigits) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <DecimalField
        name={name}
        label={this.msg(`correctionflight.create.dialog.${label}`)}
        value={this.getValue(name)}
        onChange={this.handleDecimalChange(name)}
        cy={`${name}-field`}
        margin="normal"
        fullWidth
        error={hasError}
        disabled={disabled || isDisabled}
        fractionDigits={fractionDigits}
      />
    ))
  }

  renderIntegerField(name, label, disabled) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <IntegerField
        label={this.msg(`correctionflight.create.dialog.${label}`)}
        value={this.getValue(name)}
        onChange={this.handleIntegerChange(name)}
        cy={`${name}-field`}
        margin="normal"
        fullWidth
        error={hasError}
        disabled={disabled || isDisabled}
      />
    ))
  }

  renderMultilineTextField(name, rows) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <TextField
        label={this.msg(`correctionflight.create.dialog.${name.toLowerCase()}`)}
        value={this.getValue(name, '')}
        onChange={this.handleMultilineTextChange(name)}
        data-cy={`${name}-field`}
        margin="normal"
        multiline
        fullWidth
        rows={rows}
        error={hasError}
        disabled={isDisabled}
      />
    ))
  }

  renderLoadingIcon() {
    return (
      <div className={this.props.classes.loadingIconContainer}>
        <LoadingIcon />
      </div>
    )
  }
}

const dataShape = PropTypes.shape({
  date: PropTypes.string,
  time: PropTypes.string,
  pilot: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  aerodrome: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  newAerodrome: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  remarks: PropTypes.string,
  counters: PropTypes.shape({
    landings: PropTypes.shape({
      start: PropTypes.number,
      end: PropTypes.number
    }),
    flightHours: PropTypes.shape({
      start: PropTypes.number,
      end: PropTypes.number
    }),
    engineHours: PropTypes.shape({
      start: PropTypes.number,
      end: PropTypes.number
    }),
    flightTimeCounter: PropTypes.shape({
      start: PropTypes.number,
      end: PropTypes.number
    }),
    engineTimeCounter: PropTypes.shape({
      start: PropTypes.number,
      end: PropTypes.number
    })
  })
})

CorrectionFlightCreateDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  data: dataShape.isRequired,
  corrections: PropTypes.objectOf(
    PropTypes.shape({
      start: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      end: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
    })
  ),
  validationErrors: PropTypes.objectOf(PropTypes.string),
  submitting: PropTypes.bool,
  loadMembers: PropTypes.func.isRequired,
  loadAerodromes: PropTypes.func.isRequired,
  aircraftSettings: PropTypes.shape({
    flightTimeCounterEnabled: PropTypes.bool.isRequired,
    flightTimeCounterFractionDigits: PropTypes.oneOf([1, 2]),
    engineHoursCounterEnabled: PropTypes.bool.isRequired,
    engineHoursCounterFractionDigits: PropTypes.oneOf([1, 2]),
    lockDate: PropTypes.object
  }).isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  onCloseEnterCorrectionsAlert: PropTypes.func.isRequired,
  onCloseCorrectionsConfirmationDialog: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(CorrectionFlightCreateDialog))
