import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import { FormattedMessage, injectIntl } from 'react-intl'
import Typography from '@material-ui/core/Typography'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { intl as intlShape } from '../../../../../../shapes'

class LockDateForm extends React.Component {
  getDate = () => {
    const date = this.props.date
    if (!date) {
      return null
    }

    // we have to subtract 1 day because we want flights to be editable *after* that day
    // (so it's stored with time 00:00 of the *next* day in the Firestore database)
    return moment(date).subtract(1, 'days').toDate()
  }

  toDateString = momentDate => {
    if (!momentDate) {
      return null
    }

    // we have to add 1 day because we want flights to be editable *after* that day
    // (is stored with time 00:00 in the Firestore database)
    return momentDate.add(1, 'days').format('YYYY-MM-DD')
  }

  handleDateChange = momentDate => {
    const { organizationId, updateDate } = this.props
    if (!momentDate || momentDate.isValid() === true) {
      const newDate = this.toDateString(momentDate)
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
          value={this.getDate()}
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
