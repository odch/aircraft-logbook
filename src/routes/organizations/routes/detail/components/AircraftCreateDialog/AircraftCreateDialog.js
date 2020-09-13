import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import { intl as intlShape } from '../../../../../../shapes'

const styles = {
  loadingIndicator: {
    marginRight: 5
  }
}

class AircraftCreateDialog extends React.Component {
  handleRegistrationChange = e => {
    this.props.updateData({
      registration: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
    })
  }

  handleSubmit = e => {
    const { organizationId, data, onSubmit } = this.props

    e.preventDefault()

    if (onSubmit) {
      onSubmit(organizationId, data)
    }
  }

  handleClose = () => {
    const { submitted, onClose } = this.props

    if (!submitted && onClose) {
      onClose()
    }
  }

  render() {
    const { data, submitted, duplicate, classes, onClose } = this.props
    return (
      <Dialog onClose={this.handleClose} data-cy="aircraft-create-dialog" open>
        <DialogTitle>
          <FormattedMessage id="aircrafts.create.dialog.title" />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              <FormattedMessage id="aircrafts.create.dialog.text" />
            </DialogContentText>
            <FormControl fullWidth error={duplicate}>
              <TextField
                autoFocus
                margin="dense"
                label={this.props.intl.formatMessage({
                  id: 'aircrafts.create.dialog.registration'
                })}
                type="text"
                fullWidth
                required
                value={data.registration}
                onChange={this.handleRegistrationChange}
                data-cy="registration-field"
                disabled={submitted}
              />
              {duplicate && (
                <FormHelperText>
                  <FormattedMessage id="aircrafts.create.dialog.duplicate" />
                </FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary" disabled={submitted}>
              <FormattedMessage id="aircrafts.create.dialog.buttons.cancel" />
            </Button>
            <Button
              type="submit"
              color="primary"
              data-cy="create-button"
              disabled={submitted}
            >
              {submitted && (
                <CircularProgress
                  size={16}
                  className={classes.loadingIndicator}
                />
              )}
              <FormattedMessage id="aircrafts.create.dialog.buttons.create" />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

AircraftCreateDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    registration: PropTypes.string
  }).isRequired,
  submitted: PropTypes.bool,
  duplicate: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  intl: intlShape
}

export default withStyles(styles)(injectIntl(AircraftCreateDialog))
