import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { withStyles } from '@material-ui/core/styles'
import { intl as intlShape } from '../../../../../../shapes'

const styles = {
  datePicker: {
    marginRight: 10
  }
}

class ExportFlightsForm extends React.Component {
  handleSubmit = e => {
    const { exportFlights, organizationId, data } = this.props

    e.preventDefault()

    if (data.startDate && data.endDate) {
      exportFlights(organizationId, data.startDate, data.endDate)
    }
  }

  handleDateChange = name => momentDate => {
    const newValue = momentDate ? momentDate.format('YYYY-MM-DD') : null
    this.props.updateData({
      [name]: newValue
    })
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    return (
      <>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id="organization.settings.exportflights" />
        </Typography>
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
                !this.props.data.startDate ||
                !this.props.data.endDate ||
                this.props.submitting
              }
            >
              <FormattedMessage id="organization.settings.exportflights" />
            </Button>
          </div>
        </form>
      </>
    )
  }

  renderDatePicker = name => (
    <KeyboardDatePicker
      label={this.msg(
        `organization.settings.exportflights.${name.toLowerCase()}`
      )}
      value={this.props.data[name]}
      onChange={this.handleDateChange(name)}
      className={this.props.classes.datePicker}
      disabled={this.props.submitting}
      format="DD.MM.YYYY"
      margin="normal"
      autoOk
    />
  )
}

ExportFlightsForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }),
  updateData: PropTypes.func.isRequired,
  exportFlights: PropTypes.func.isRequired,
  intl: intlShape,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(ExportFlightsForm))
