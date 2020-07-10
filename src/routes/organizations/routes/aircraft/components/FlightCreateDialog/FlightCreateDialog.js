import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import _get from 'lodash.get'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers'
import Select from '../../../../../../components/Select'
import DecimalField from '../../../../../../components/DecimalField'
import IntegerField from '../../../../../../components/IntegerField'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import { intl as intlShape } from '../../../../../../shapes'
import getMissingFields from '../../util/getMissingFields'
import CreateAerodromeDialog from '../../containers/CreateAerodromeDialogContainer'

const styles = theme => ({
  loadingIconContainer: {
    height: 200
  },
  initialValuesContainer: {
    backgroundColor: theme.palette.grey[100],
    padding: '1em',
    borderRadius: 4
  }
})

class FlightCreateDialog extends React.Component {
  handleDateChange = name => momentDate => {
    const newValue = momentDate ? momentDate.format('YYYY-MM-DD') : null
    this.updateData(name, newValue)
  }

  handleTimeChange = name => momentDate => {
    const newValue = momentDate ? momentDate.format('YYYY-MM-DD HH:mm') : null
    this.updateData(name, newValue)
  }

  handleSelectChange = name => value => {
    this.updateData(name, value)
  }

  handleSelectCreateOption = name => (/*value*/) => {
    this.props.openCreateAerodromeDialog(name)
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

  handleTroublesRadioChange = e => {
    this.updateData('troublesObservations', e.target.value)
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
      const messageKey = `flight.create.dialog.validation.${name}.${errorKey}`.toLowerCase()
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

  msg = (id, values) => this.props.intl.formatMessage({ id }, values)

  hasInitialValue = name => !!_get(this.props.initialData, name)

  withSpace = aerodromeValue =>
    aerodromeValue === undefined ? '' : ' ' + aerodromeValue.label

  getLandingsLabel = () => {
    const destinationAerodrome = this.withSpace(
      this.getValue('destinationAerodrome')
    )
    return this.msg(`flight.create.dialog.landings`, {
      destinationAerodrome
    })
  }

  getLandingsHelperText = () => {
    const departureAerodrome = this.withSpace(
      this.getValue('departureAerodrome')
    )
    const destinationAerodrome = this.withSpace(
      this.getValue('destinationAerodrome')
    )

    return this.msg(`flight.create.dialog.landings.helpertext`, {
      departureAerodrome,
      destinationAerodrome
    })
  }

  render() {
    const { data, createAerodromeDialogOpen, organizationId } = this.props
    return (
      <React.Fragment>
        <Dialog onClose={this.handleClose} data-cy="flight-create-dialog" open>
          <DialogTitle>
            <FormattedMessage id="flight.create.dialog.title" />
          </DialogTitle>
          {data.initialized ? this.renderForm() : this.renderLoadingIcon()}
        </Dialog>
        {createAerodromeDialogOpen && (
          <CreateAerodromeDialog organizationId={organizationId} />
        )}
      </React.Fragment>
    )
  }

  renderForm() {
    const {
      submitting,
      onClose,
      flightNatures = [],
      loadMembers,
      loadAerodromes,
      aircraftSettings: { fuelTypes, engineHoursCounterEnabled }
    } = this.props

    return (
      <form onSubmit={this.handleSubmit}>
        <DialogContent>
          {this.renderRequiredInitialValueFields()}
          {this.renderDatePicker('date')}
          {this.renderMemberSelect('pilot', loadMembers)}
          {this.renderMemberSelect('instructor', loadMembers)}
          {this.renderSelect('nature', flightNatures)}
          {this.renderAerodromeSelect(
            'departureAerodrome',
            loadAerodromes,
            this.hasInitialValue('departureAerodrome')
          )}
          {this.renderAerodromeSelect('destinationAerodrome', loadAerodromes)}
          {this.renderInTwoColumns(
            'counters.flighttimecounter',
            this.renderDecimalField(
              'counters.flightTimeCounter.start',
              this.hasInitialValue('counters.flightTimeCounter.start')
            ),
            this.renderDecimalField('counters.flightTimeCounter.end')
          )}
          {engineHoursCounterEnabled &&
            this.renderInTwoColumns(
              'counters.enginetimecounter',
              this.renderDecimalField(
                'counters.engineTimeCounter.start',
                this.hasInitialValue('counters.engineTimeCounter.start')
              ),
              this.renderDecimalField('counters.engineTimeCounter.end')
            )}
          {this.renderTimePicker('blockOffTime')}
          {this.renderTimePicker('takeOffTime')}
          {this.renderTimePicker('landingTime', true)}
          {this.renderTimePicker('blockOnTime')}
          {this.renderIntegerField(
            'landings',
            this.getLandingsLabel(),
            this.getLandingsHelperText()
          )}
          {this.renderIntegerField('personsOnBoard')}
          {this.renderInTwoColumns(
            'fuel',
            this.renderDecimalField('fuelUplift'),
            this.renderSelect('fuelType', fuelTypes)
          )}
          {this.renderDecimalField('oilUplift')}
          {this.renderObservationsSection()}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" disabled={submitting}>
            <FormattedMessage id="flight.create.dialog.buttons.cancel" />
          </Button>
          <Button
            type="submit"
            color="primary"
            data-cy="create-button"
            disabled={submitting}
          >
            <FormattedMessage id="flight.create.dialog.buttons.create" />
          </Button>
        </DialogActions>
      </form>
    )
  }

  renderRequiredInitialValueFields() {
    const {
      initialData,
      aircraftSettings: { engineHoursCounterEnabled },
      classes
    } = this.props

    const requiredFields = [
      'counters.flights.start',
      'counters.landings.start',
      'counters.flightHours.start'
    ]
    if (engineHoursCounterEnabled) {
      requiredFields.push('counters.engineHours.start')
    }

    const requiredInitialValues = getMissingFields(initialData, requiredFields)

    if (requiredInitialValues.length === 0) {
      return null
    }

    return (
      <div className={classes.initialValuesContainer}>
        <Typography>
          <FormattedMessage id={`flight.create.dialog.requiredinitialvalues`} />
        </Typography>
        {requiredInitialValues.includes('counters.flights.start') &&
          this.renderIntegerField('counters.flights.start')}
        {requiredInitialValues.includes('counters.landings.start') &&
          this.renderIntegerField('counters.landings.start')}
        {requiredInitialValues.includes('counters.flightHours.start') &&
          this.renderDecimalField('counters.flightHours.start')}
        {requiredInitialValues.includes('counters.engineHours.start') &&
          this.renderDecimalField('counters.engineHours.start')}
      </div>
    )
  }

  renderInTwoColumns(label, component1, component2) {
    return (
      <FormControl component="fieldset" margin="normal" fullWidth>
        <FormLabel component="legend">
          <FormattedMessage id={`flight.create.dialog.${label}`} />
        </FormLabel>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            {component1}
          </Grid>
          <Grid item xs={12} sm={6}>
            {component2}
          </Grid>
        </Grid>
      </FormControl>
    )
  }

  renderInFormControl(name, renderFn, helperText, margin) {
    const errorMsg = this.getErrorMessage(name)
    const hasError = !!errorMsg

    const isDisabled = this.props.submitting

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

  renderSelect(name, options) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <Select
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        value={this.getValue(name)}
        onChange={this.handleSelectChange(name)}
        options={options}
        data-cy={`${name}-field`}
        margin="normal"
        error={hasError}
        disabled={isDisabled}
      />
    ))
  }

  renderMemberSelect(name, loadMembers) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <Select
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
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

  renderAerodromeSelect(name, loadAerodromes, disabled) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <Select
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        value={this.getValue(name)}
        onChange={this.handleSelectChange(name)}
        loadOptions={loadAerodromes}
        data-cy={`${name}-field`}
        margin="normal"
        error={hasError}
        disabled={disabled || isDisabled}
        creatable={true}
        onCreateOption={this.handleSelectCreateOption(name)}
        onCreateOptionText="Flugplatz nicht gefunden? Klicke hier, um einen neuen Flugplatz zu erstellen."
      />
    ))
  }

  renderDatePicker(name) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <KeyboardDatePicker
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        value={this.getValue(name)}
        onChange={this.handleDateChange(name)}
        format="DD.MM.YYYY"
        data-cy={`${name}-field`}
        margin="normal"
        fullWidth
        autoOk
        clearable
        invalidDateMessage={this.msg('flight.create.dialog.dateinvalid')}
        error={hasError}
        disabled={isDisabled}
      />
    ))
  }

  renderTimePicker(name, disabled) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <KeyboardTimePicker
        ampm={false}
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        value={this.getValue(name)}
        onChange={this.handleTimeChange(name)}
        data-cy={`${name}-field`}
        margin="normal"
        fullWidth
        autoOk
        clearable
        invalidDateMessage={this.msg('flight.create.dialog.timeinvalid')}
        error={hasError}
        disabled={disabled || isDisabled}
      />
    ))
  }

  renderDecimalField(name, disabled) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <DecimalField
        name={name}
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        value={this.getValue(name)}
        onChange={this.handleDecimalChange(name)}
        cy={`${name}-field`}
        margin="normal"
        fullWidth
        error={hasError}
        disabled={disabled || isDisabled}
      />
    ))
  }

  renderIntegerField(name, label, helperText) {
    if (!label) {
      label = this.msg(`flight.create.dialog.${name.toLowerCase()}`)
    }

    return this.renderInFormControl(
      name,
      (hasError, isDisabled) => (
        <IntegerField
          label={label}
          value={this.getValue(name)}
          onChange={this.handleIntegerChange(name)}
          cy={`${name}-field`}
          margin="normal"
          fullWidth
          error={hasError}
          disabled={isDisabled}
        />
      ),
      helperText
    )
  }

  renderMultilineTextField(name) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <TextField
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        value={this.getValue(name, '')}
        onChange={this.handleMultilineTextChange(name)}
        data-cy={`${name}-field`}
        margin="normal"
        multiline
        fullWidth
        rows={5}
        error={hasError}
        disabled={isDisabled}
      />
    ))
  }

  renderObservationsSection() {
    const { techlogEntryStatusOptions, data } = this.props
    const value = data.troublesObservations || ''
    return this.renderInFormControl(
      'troublesObservations',
      (hasError, isDisabled) => (
        <>
          <FormLabel component="legend">
            <FormattedMessage id="flight.create.dialog.troublesobservations" />
          </FormLabel>
          <RadioGroup
            name="troublesObservations"
            value={value}
            onChange={this.handleTroublesRadioChange}
          >
            <FormControlLabel
              value="nil"
              control={<Radio disabled={isDisabled} />}
              label={this.msg('flight.create.dialog.troublesobservations.nil')}
            />
            <FormControlLabel
              value="troubles"
              control={<Radio disabled={isDisabled} />}
              label={this.msg(
                'flight.create.dialog.troublesobservations.troubles'
              )}
            />
          </RadioGroup>
          {value === 'troubles' && (
            <>
              {this.renderSelect(
                'techlogEntryStatus',
                techlogEntryStatusOptions
              )}
              {this.renderMultilineTextField('techlogEntryDescription')}
            </>
          )}
        </>
      ),
      null,
      'normal'
    )
  }

  renderLoadingIcon() {
    return (
      <div className={this.props.classes.loadingIconContainer}>
        <LoadingIcon />
      </div>
    )
  }
}

const flightDataShape = PropTypes.shape({
  date: PropTypes.string,
  nature: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  blockOffTime: PropTypes.string,
  takeOffTime: PropTypes.string,
  landingTime: PropTypes.string,
  blockOnTime: PropTypes.string,
  pilot: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  departureAerodrome: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  destinationAerodrome: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  landings: PropTypes.number,
  fuelUplift: PropTypes.number,
  fuelType: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  oilUplift: PropTypes.number,
  remarks: PropTypes.string,
  counters: PropTypes.shape({
    flights: PropTypes.shape({
      start: PropTypes.number,
      end: PropTypes.number
    }),
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

FlightCreateDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  initialData: flightDataShape.isRequired,
  data: flightDataShape.isRequired,
  validationErrors: PropTypes.objectOf(PropTypes.string),
  submitting: PropTypes.bool,
  flightNatures: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  techlogEntryStatusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  loadMembers: PropTypes.func.isRequired,
  loadAerodromes: PropTypes.func.isRequired,
  aircraftSettings: PropTypes.shape({
    fuelTypes: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })
    ).isRequired,
    engineHoursCounterEnabled: PropTypes.bool.isRequired
  }).isRequired,
  createAerodromeDialogOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  openCreateAerodromeDialog: PropTypes.func.isRequired,
  intl: intlShape,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(FlightCreateDialog))
