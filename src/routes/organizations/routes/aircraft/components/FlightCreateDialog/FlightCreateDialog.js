import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import _get from 'lodash.get'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import { DatePicker, TimePicker } from 'material-ui-pickers'
import Select from '../../../../../../components/Select'
import HoursCounterField from '../../../../../../components/HoursCounterField'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import {
  aerodrome as aerodromeShape,
  member as memberShape
} from '../../../../../../shapes'
import { getMemberOptions, getAerodromeOptions } from '../../util/getOptions'

const styles = {
  loadingIconContainer: {
    height: 200
  }
}

class FlightCreateDialog extends React.Component {
  handleDateChange = name => momentDate => {
    this.updateData(name, momentDate.format('YYYY-MM-DD'))
  }

  handleTimeChange = name => momentDate => {
    this.updateData(name, momentDate.format('YYYY-MM-DD HH:mm'))
  }

  handleSelectChange = name => value => {
    this.updateData(name, value)
  }

  handleHoursCounterChange = name => value => {
    this.updateData(name, value)
  }

  handleIntegerChange = name => e => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      const intValue = value ? parseInt(value) : undefined
      this.updateData(name, intValue)
    }
  }

  updateData = (name, value) => {
    this.props.updateData({
      [name]: value
    })
  }

  getValue = (name, defaultValue) => _get(this.props.data, name, defaultValue)

  handleSubmit = e => {
    const { onSubmit, organizationId, aircraftId, data } = this.props

    e.preventDefault()
    if (onSubmit) {
      onSubmit(organizationId, aircraftId, data)
    }
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const { onClose, data } = this.props
    return (
      <Dialog onClose={onClose} data-cy="flight-create-dialog" open>
        <DialogTitle>
          <FormattedMessage id="flight.create.dialog.title" />
        </DialogTitle>
        {data.initialized ? this.renderForm() : this.renderLoadingIcon()}
      </Dialog>
    )
  }

  renderForm() {
    const { onClose, organizationMembers = [], aerodromes = [] } = this.props

    const memberOptions = getMemberOptions(organizationMembers)
    const aerodromeOptions = getAerodromeOptions(aerodromes)

    return (
      <form onSubmit={this.handleSubmit}>
        <DialogContent>
          {this.renderDatePicker('date')}
          {this.renderSelect('pilot', memberOptions)}
          {this.renderSelect('departureAerodrome', aerodromeOptions)}
          {this.renderSelect('destinationAerodrome', aerodromeOptions)}
          {this.renderTimePicker('blockOffTime')}
          {this.renderTimePicker('takeOffTime')}
          {this.renderTimePicker('landingTime')}
          {this.renderTimePicker('blockOnTime')}
          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Flugstunden</FormLabel>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                {this.renderHoursCounterField('counters.flightHours.start')}
              </Grid>
              <Grid item xs={12} sm={6}>
                {this.renderHoursCounterField('counters.flightHours.end')}
              </Grid>
            </Grid>
          </FormControl>
          {this.renderNumberField('landings')}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            <FormattedMessage id="flight.create.dialog.buttons.cancel" />
          </Button>
          <Button type="submit" color="primary" data-cy="create-button">
            <FormattedMessage id="flight.create.dialog.buttons.create" />
          </Button>
        </DialogActions>
      </form>
    )
  }

  renderSelect(name, options) {
    return (
      <Select
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        value={this.props.data[name]}
        onChange={this.handleSelectChange(name)}
        options={options}
        data-cy={`${name}-field`}
        margin="normal"
      />
    )
  }

  renderDatePicker(name) {
    return (
      <DatePicker
        keyboard
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        value={this.props.data[name]}
        onChange={this.handleDateChange(name)}
        format="L"
        data-cy={`${name}-field`}
        margin="normal"
        fullWidth
        autoOk
      />
    )
  }

  renderTimePicker(name) {
    return (
      <TimePicker
        keyboard
        ampm={false}
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        value={this.props.data[name]}
        onChange={this.handleTimeChange(name)}
        data-cy={`${name}-field`}
        margin="normal"
        fullWidth
        autoOk
      />
    )
  }

  renderHoursCounterField(name) {
    return (
      <HoursCounterField
        name={name}
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        value={this.getValue(name)}
        onChange={this.handleHoursCounterChange(name)}
        cy={`${name}-field`}
        margin="normal"
        fullWidth
      />
    )
  }

  renderNumberField(name) {
    return (
      <TextField
        label={this.msg(`flight.create.dialog.${name.toLowerCase()}`)}
        value={this.getValue(name, '')}
        onChange={this.handleIntegerChange(name)}
        cy={`${name}-field`}
        type="number"
        margin="normal"
        fullWidth
      />
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

FlightCreateDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    date: PropTypes.string,
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
    })
  }).isRequired,
  organizationMembers: PropTypes.arrayOf(memberShape),
  aerodromes: PropTypes.arrayOf(aerodromeShape),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  intl: intlShape,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(FlightCreateDialog))
