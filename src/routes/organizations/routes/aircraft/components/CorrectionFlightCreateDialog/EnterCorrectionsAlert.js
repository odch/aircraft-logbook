import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const EnterCorrectionsAlert = ({ onClose }) => (
  <Dialog onClose={onClose} open>
    <DialogTitle>
      <FormattedMessage id="correctionflight.create.dialog.alert.title" />
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        <FormattedMessage id="correctionflight.create.dialog.alert.text" />
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary" autoFocus>
        <FormattedMessage id="correctionflight.create.dialog.alert.buttons.close" />
      </Button>
    </DialogActions>
  </Dialog>
)

EnterCorrectionsAlert.propTypes = {
  onClose: PropTypes.func
}

export default EnterCorrectionsAlert
