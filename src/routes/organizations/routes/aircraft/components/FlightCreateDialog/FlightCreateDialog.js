import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { withStyles } from '@material-ui/core/styles'
import { DatePicker, TimePicker } from 'material-ui-pickers'
import Select from '../../../../../../components/Select'
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

  updateData = (name, value) => {
    this.props.updateData({
      [name]: value
    })
  }

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
