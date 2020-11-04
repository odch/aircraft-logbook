import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import Typography from '@material-ui/core/Typography'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { intl as intlShape } from '../../../../../../shapes'

class LockDateForm extends React.Component {
  handleDateChange = momentDate => {
    const { organizationId, updateDate } = this.props
    if (!momentDate || momentDate.isValid() === true) {
      const newDate = momentDate ? momentDate.format('YYYY-MM-DD') : null
      updateDate(organizationId, newDate)
    }
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    return (
      <>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id="organization.settings.lockdate" />
        </Typography>
        <Typography>
          <FormattedMessage id="organization.settings.lockdate.description" />
        </Typography>
        <KeyboardDatePicker
          label={this.msg('organization.settings.lockdate')}
          value={this.props.date}
          onChange={this.handleDateChange}
          disabled={this.props.submitting}
          format="DD.MM.YYYY"
          margin="normal"
          autoOk
          clearable
        />
      </>
    )
  }
}

LockDateForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  date: PropTypes.object,
  updateDate: PropTypes.func.isRequired,
  intl: intlShape
}

export default injectIntl(LockDateForm)
