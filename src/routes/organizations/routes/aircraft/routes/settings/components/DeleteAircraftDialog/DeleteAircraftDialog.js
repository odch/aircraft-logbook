import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DeleteButton from '../../../../../../../../components/DeleteButton'
import { intl as intlShape } from '../../../../../../../../shapes'

class DeleteAircraftDialog extends React.Component {
  state = {
    registration: ''
  }

  handleExited = () => {
    this.setState({
      registration: ''
    })
  }

  handleRegistrationChange = e => {
    this.setState({
      registration: e.target.value.toUpperCase()
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.props.onConfirm) {
      this.props.onConfirm()
    }
  }

  handleClose = () => {
    if (!this.props.submitting && this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    const { open, registration, submitting, intl } = this.props
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        onExited={this.handleExited}
        data-cy="aircraft-delete-dialog"
      >
        <DialogTitle>
          <FormattedMessage id="aircrafts.delete.dialog.title" />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              <FormattedMessage id="aircrafts.delete.dialog.text" />
              &nbsp;
              <strong>{registration}</strong>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              placeholder={intl.formatMessage({
                id: 'aircrafts.delete.dialog.registration'
              })}
              type="text"
              value={this.state.registration}
              onChange={this.handleRegistrationChange}
              data-cy="aircraft-registration-field"
              disabled={submitting}
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} disabled={submitting}>
              <FormattedMessage id="aircrafts.delete.dialog.buttons.cancel" />
            </Button>
            <DeleteButton
              type="submit"
              color="secondary"
              variant="contained"
              disabled={submitting || this.state.registration !== registration}
              inProgress={submitting}
              label={intl.formatMessage({
                id: 'aircrafts.delete.dialog.buttons.delete'
              })}
              data-cy="aircraft-delete-button"
            />
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

DeleteAircraftDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  registration: PropTypes.string.isRequired,
  open: PropTypes.bool,
  submitting: PropTypes.bool,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  intl: intlShape
}

export default injectIntl(DeleteAircraftDialog)
