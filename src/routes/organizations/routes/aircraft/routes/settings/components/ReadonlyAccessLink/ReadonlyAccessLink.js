import React, { useState } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import {
  organization as organizationShape,
  intl as intlShape
} from '../../../../../../../../shapes'

const ReadonlyAccessLink = ({ organization, intl }) => {
  if (!organization.readonlyAccessEnabled) {
    return null
  }

  const url = window.location.href.replace(
    /\/settings$/,
    `?t=${organization.id}-${organization.readonlyAccessToken}`
  )

  const [copied, setCopied] = useState(false)

  const handleTooltipClose = () => {
    setCopied(false)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
  }

  return (
    <Box my={4}>
      <Typography variant="h5" gutterBottom>
        <FormattedMessage id="aircraft.settings.readonlyaccess" />
      </Typography>
      <Typography>
        <FormattedMessage id="aircraft.settings.readonlyaccess.description" />
      </Typography>
      <TextField
        value={url}
        margin="normal"
        variant="outlined"
        fullWidth
        InputProps={{
          readOnly: true
        }}
      />
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Box textAlign="center">
          <Tooltip
            PopperProps={{
              disablePortal: true
            }}
            onClose={handleTooltipClose}
            open={copied}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={intl.formatMessage({
              id: 'aircraft.settings.readonlyaccess.copied'
            })}
          >
            <Button variant="contained" onClick={handleCopyToClipboard}>
              <FormattedMessage id="aircraft.settings.readonlyaccess.copytoclipboard" />
            </Button>
          </Tooltip>
        </Box>
      </ClickAwayListener>
    </Box>
  )
}

ReadonlyAccessLink.propTypes = {
  organization: organizationShape.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(ReadonlyAccessLink)
