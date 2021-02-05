import React from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import { intl as intlShape } from '../../../shapes'
import SettingSelect from '../../../components/SettingSelect'

const Locale = ({ locale, intl, updateLocale }) => (
  <List>
    <SettingSelect
      label={intl.formatMessage({ id: 'profile.locale' })}
      value={locale}
      options={[
        { value: 'en', label: 'English' },
        { value: 'de', label: 'Deutsch' }
      ]}
      submitting={false}
      onChange={updateLocale}
    />
  </List>
)

Locale.propTypes = {
  locale: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  updateLocale: PropTypes.func.isRequired
}

export default injectIntl(Locale)
