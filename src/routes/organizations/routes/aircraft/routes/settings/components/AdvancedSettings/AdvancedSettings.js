import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import SettingSwitch from './SettingSwitch'
import { intl as intlShape } from '../../../../../../../../shapes'

const msg = (intl, id) => intl.formatMessage({ id })

const AdvancedSettings = ({
  organizationId,
  aircraftId,
  settings: { techlogEnabled },
  submitting: { techlogEnabled: techlogEnabledSubmitting },
  intl,
  updateSetting
}) => (
  <>
    <Typography variant="h5" gutterBottom>
      <FormattedMessage id="aircraft.settings.advanced" />
    </Typography>
    <List>
      <SettingSwitch
        label={msg(intl, 'aircraft.settings.advanced.techlogenabled')}
        checked={techlogEnabled}
        submitting={techlogEnabledSubmitting}
        onChange={updateSetting.bind(
          null,
          organizationId,
          aircraftId,
          'techlogEnabled'
        )}
      />
    </List>
  </>
)

AdvancedSettings.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    techlogEnabled: PropTypes.bool.isRequired
  }),
  submitting: PropTypes.shape({
    techlogEnabled: PropTypes.bool
  }).isRequired,
  intl: intlShape,
  updateSetting: PropTypes.func.isRequired
}

export default injectIntl(AdvancedSettings)
