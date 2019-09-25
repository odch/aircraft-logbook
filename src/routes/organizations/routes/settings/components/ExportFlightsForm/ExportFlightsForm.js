import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment-timezone'
import { intl as intlShape } from '../../../../../../shapes'

const styles = {
  datePicker: {
    marginRight: 10
  }
}

class ExportFlightsForm extends React.Component {
  state = {
    startDate: moment()
      .subtract(1, 'months')
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: moment()
      .subtract(1, 'months')
      .endOf('month')
      .format('YYYY-MM-DD')
  }

  handleSubmit = e => {
    const { exportFlights, organizationId } = this.props
    const { startDate, endDate } = this.state

    e.preventDefault()

    if (startDate && endDate) {
      exportFlights(organizationId, startDate, endDate)
    }
  }

  handleDateChange = name => momentDate => {
    const newValue = momentDate ? momentDate.format('YYYY-MM-DD') : null
    this.setState({
      [name]: newValue
    })
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          {this.renderDatePicker('startDate')}
          {this.renderDatePicker('endDate')}
        </div>
        <div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={this.handleFlightsExportClick}
            disabled={
              !this.state.startDate ||
              !this.state.endDate ||
              this.props.submitting
            }
          >
            <FormattedMessage id="organization.settings.exportflights" />
          </Button>
        </div>
      </form>
    )
  }

  renderDatePicker = name => (
    <KeyboardDatePicker
      label={this.msg(
        `organization.settings.exportflights.${name.toLowerCase()}`
      )}
      value={this.state[name]}
      onChange={this.handleDateChange(name)}
      className={this.props.classes.datePicker}
      disabled={this.props.submitting}
      format="L"
      margin="normal"
      autoOk
    />
  )
}

ExportFlightsForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  exportFlights: PropTypes.func.isRequired,
  intl: intlShape,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(ExportFlightsForm))
