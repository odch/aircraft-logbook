import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import {
  organization as organizationShape,
  intl as intlShape
} from '../../../../../../shapes'

const styles = {
  loadingIndicator: {
    verticalAlign: 'middle',
    height: '0.85em',
    marginLeft: '0.5em'
  }
}

const ReadonlyAccessSwitch = ({
  organization,
  submitting,
  classes,
  intl,
  setEnabled
}) => (
  <Box my={4}>
    <Typography variant="h5" gutterBottom>
      <FormattedMessage id="organization.settings.readonlyaccess" />
    </Typography>
    <Typography>
      <FormattedMessage id="organization.settings.readonlyaccess.description" />
    </Typography>
    <Box my={2}>
      <FormControlLabel
        control={
          <>
            {submitting && (
              <CircularProgress
                size={16}
                className={classes.loadingIndicator}
              />
            )}
            <Switch
              edge="end"
              onChange={e => setEnabled(organization.id, e.target.checked)}
              checked={organization.readonlyAccessEnabled === true}
              disabled={submitting}
            />
          </>
        }
        label={intl.formatMessage({
          id: 'organization.settings.readonlyaccess'
        })}
        labelPlacement="start"
      />
    </Box>
  </Box>
)

ReadonlyAccessSwitch.propTypes = {
  organization: organizationShape.isRequired,
  submitting: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  setEnabled: PropTypes.func.isRequired
}

export default withStyles(styles)(injectIntl(ReadonlyAccessSwitch))
