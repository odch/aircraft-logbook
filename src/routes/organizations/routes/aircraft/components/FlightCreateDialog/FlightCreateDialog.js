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
import Attachments from '../Attachments/'
import FileButton from '../FileButton/'
import Checkbox from '@material-ui/core/Checkbox'

const styles = theme => ({
  loadingIconContainer: {
    height: 200,
    width: 200
  },
  initialValuesContainer: {
    backgroundColor: theme.palette.grey[100],
    padding: '1em',
    borderRadius: 4
  },
  techlogEntryAttachments: {
    marginTop: '0.5em'
  },
  addTechlogEntryAttachmentButton: {
    marginTop: '0.5em'
  },
  error: {
    color: theme.palette.error.main
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

  handleCheckboxChange = name => e => {
    this.updateData(name, e.target.checked)
  }

  handleTroublesRadioChange = e => {
    this.updateData('troublesObservations', e.target.value)
  }

  handleFileSelect = files => {
    const newAttachments = [...(this.props.data.techlogEntryAttachments || [])]
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
    this.updateData('techlogEntryAttachments', newAttachments)
  }

  removeAttachment = (attachment, index) => {
    const attachments = this.props.data.techlogEntryAttachments
    const newAttachments = attachments
      .slice(0, index)
      .concat(attachments.slice(index + 1, attachments.length))
    this.updateData('techlogEntryAttachments', newAttachments)
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

  isVisibleField = name =>
    !this.props.visibleFields ||
    this.props.visibleFields.length === 0 ||
    this.props.visibleFields.includes(name)

  isEditableField = name =>
    !this.props.submitting &&
    (!this.props.editableFields ||
      this.props.editableFields.length === 0 ||
      this.props.editableFields.includes(name))

  withSpace = aerodromeValue =>
    !aerodromeValue ? '' : ' ' + aerodromeValue.label

  getLandingsLabel = () => {
    const destinationAerodrome = this.getValue('destinationAerodrome')
    return destinationAerodrome
      ? this.msg('flight.create.dialog.landingsknown', {
          destinationAerodrome: destinationAerodrome.label
        })
      : this.msg('flight.create.dialog.landingsunknown')
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

  getMinDate = lockDate => {
    if (!lockDate) {
      return undefined
    }
    return lockDate
  }

  natureOption = id => ({
    value: id,
    label: this.msg(`flight.nature.${id}`)
  })

  render() {
    const { data, createAerodromeDialogOpen, organizationId } = this.props
    return (
      <React.Fragment>
        <Dialog onClose={this.handleClose} data-cy="flight-create-dialog" open>
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
      data,
      submitting,
      onClose,
      flightNatures = [],
      loadMembers,
      loadInstructors,
      loadAerodromes,
      aircraftSettings: {
        fuelTypes,
        flightTimeCounterEnabled,
        flightTimeCounterFractionDigits,
        engineHoursCounterEnabled,
        engineHoursCounterFractionDigits,
        engineTachHoursCounterEnabled,
        engineTachHoursCounterFractionDigits,
        lockDate
      }
    } = this.props

    return (
      <>
        <DialogTitle>
          <FormattedMessage
            id={`flight.create.dialog.title${
              data.version === 0 ? '_complete' : data.id ? '_update' : '_create'
            }`}
          />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent>
            {this.renderRequiredInitialValueFields()}
            {this.renderDatePicker('date', this.getMinDate(lockDate))}
            {this.renderMemberSelect('pilot', loadMembers)}
            {this.renderMemberSelect('instructor', loadInstructors)}
            {this.renderSelect('nature', flightNatures, value =>
              typeof value === 'string' ? this.natureOption(value) : value
            )}
            {this.renderAerodromeSelect(
              'departureAerodrome',
              loadAerodromes,
              this.hasInitialValue('departureAerodrome')
            )}
            {this.renderAerodromeSelect('destinationAerodrome', loadAerodromes)}
            {flightTimeCounterEnabled &&
              this.renderInTwoColumns(
                'counters.flighttimecounter',
                this.renderDecimalField(
                  'counters.flightTimeCounter.start',
                  this.hasInitialValue('counters.flightTimeCounter.start'),
                  flightTimeCounterFractionDigits
                ),
                this.renderDecimalField(
                  'counters.flightTimeCounter.end',
                  false,
                  flightTimeCounterFractionDigits
                )
              )}
            {engineHoursCounterEnabled &&
              this.renderInTwoColumns(
                'counters.enginetimecounter',
                this.renderDecimalField(
                  'counters.engineTimeCounter.start',
                  this.hasInitialValue('counters.engineTimeCounter.start'),
                  engineHoursCounterFractionDigits
                ),
                this.renderDecimalField(
                  'counters.engineTimeCounter.end',
                  false,
                  engineHoursCounterFractionDigits
                )
              )}
            {engineTachHoursCounterEnabled &&
              this.renderInTwoColumns(
                'counters.enginetachcounter',
                this.renderDecimalField(
                  'counters.engineTachCounter.start',
                  this.hasInitialValue('counters.engineTachCounter.start'),
                  engineTachHoursCounterFractionDigits
                ),
                this.renderDecimalField(
                  'counters.engineTachCounter.end',
                  false,
                  engineTachHoursCounterFractionDigits
                )
              )}
            {this.renderTimePicker('blockOffTime')}
            {this.renderTimePicker('takeOffTime')}
            {this.renderTimePicker('landingTime', flightTimeCounterEnabled)}
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
            {this.renderMultilineTextField('remarks')}
            {this.renderCheckbox('preflightCheck')}
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
      </>
    )
  }

  renderRequiredInitialValueFields() {
    const {
      initialData,
      aircraftSettings: {
        engineHoursCounterEnabled,
        engineHoursCounterFractionDigits,
        engineTachHoursCounterEnabled,
        engineTachHoursCounterFractionDigits
      },
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
    if (engineTachHoursCounterEnabled) {
      requiredFields.push('counters.engineTachHours.start')
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
          this.renderDecimalField(
            'counters.engineHours.start',
            false,
            engineHoursCounterFractionDigits
          )}
        {requiredInitialValues.includes('counters.engineTachHours.start') &&
          this.renderDecimalField(
            'counters.engineTachHours.start',
            false,
            engineTachHoursCounterFractionDigits
          )}
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
    if (!this.isVisibleField(name)) {
      return null
    }

    const errorMsg = this.getErrorMessage(name)
    const hasError = !!errorMsg

    const isDisabled = !this.isEditableField(name)

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

  renderSelect(name, options, valueModifier = value => value) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <Select
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        value={valueModifier(this.getValue(name))}
        onChange={this.handleSelectChange(name)}
        options={options}
        cy={`${name}-field`}
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
        cy={`${name}-field`}
        margin="normal"
        error={hasError}
        disabled={disabled || isDisabled}
        creatable={true}
        onCreateOption={this.handleSelectCreateOption(name)}
        onCreateOptionText="Flugplatz nicht gefunden? Klicke hier, um einen neuen Flugplatz zu erstellen."
      />
    ))
  }

  renderDatePicker(name, minDate) {
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
        minDate={minDate}
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

  renderDecimalField(name, disabled, fractionDigits) {
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
        fractionDigits={fractionDigits}
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

  renderMultilineTextField(name, rows) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <TextField
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
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

  renderCheckbox(name) {
    return this.renderInFormControl(name, (hasError, isDisabled) => (
      <FormControlLabel
        value={name}
        control={
          <Checkbox
            color="primary"
            checked={this.getValue(name, false)}
            onChange={this.handleCheckboxChange(name)}
            data-cy={`${name}-field`}
          />
        }
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        labelPlacement="end"
        className={hasError ? this.props.classes.error : null}
        disabled={isDisabled}
      />
    ))
  }

  renderObservationsSection() {
    const {
      techlogEntryStatusOptions,
      data,
      submitting,
      aircraftSettings: { techlogEnabled },
      classes
    } = this.props
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
              control={<Radio disabled={isDisabled} data-cy="nil-radio" />}
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
              {techlogEnabled &&
                this.renderSelect(
                  'techlogEntryStatus',
                  techlogEntryStatusOptions
                )}
              {this.renderMultilineTextField('techlogEntryDescription', 5)}
              {techlogEnabled && (
                <>
                  <Attachments
                    attachments={data.techlogEntryAttachments}
                    disabled={submitting}
                    onRemoveClick={this.removeAttachment}
                    className={classes.techlogEntryAttachments}
                  />
                  <FileButton
                    disabled={submitting}
                    label={this.msg(
                      'flight.create.dialog.techlogentryattachment.add'
                    )}
                    onSelect={this.handleFileSelect}
                    className={classes.addTechlogEntryAttachmentButton}
                  />
                </>
              )}
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
  nature: PropTypes.oneOfType([
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }),
    PropTypes.string
  ]),
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
  troublesObservations: PropTypes.oneOf(['nil', 'troubles']),
  techlogEntryStatus: PropTypes.oneOfType([
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }),
    PropTypes.string
  ]),
  techlogEntryDescription: PropTypes.string,
  techlogEntryAttachments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired
    })
  ),
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
  loadInstructors: PropTypes.func.isRequired,
  loadAerodromes: PropTypes.func.isRequired,
  aircraftSettings: PropTypes.shape({
    fuelTypes: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })
    ).isRequired,
    flightTimeCounterEnabled: PropTypes.bool.isRequired,
    flightTimeCounterFractionDigits: PropTypes.oneOf([1, 2]),
    engineHoursCounterEnabled: PropTypes.bool.isRequired,
    engineHoursCounterFractionDigits: PropTypes.oneOf([1, 2]),
    engineTachHoursCounterEnabled: PropTypes.bool.isRequired,
    engineTachHoursCounterFractionDigits: PropTypes.oneOf([1, 2]),
    techlogEnabled: PropTypes.bool.isRequired,
    lockDate: PropTypes.object
  }).isRequired,
  createAerodromeDialogOpen: PropTypes.bool.isRequired,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
  editableFields: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  openCreateAerodromeDialog: PropTypes.func.isRequired,
  intl: intlShape,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(FlightCreateDialog))
