import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DeleteButton from '../../../../../../../../components/DeleteButton'
import { intl as intlShape } from '../../../../../../../../shapes'
import { check as checkShape } from '../../../../../../../../shapes/aircraft'

class DeleteFuelTypeDialog extends React.Component {
  handleClose = () => {
    if (!this.props.submitting && this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    const { fuelType, submitting, onConfirm } = this.props
    return (
      <Dialog onClose={this.handleClose} data-cy="fuel-type-delete-dialog" open>
        <DialogTitle>
          <FormattedMessage id="aircraft.settings.fueltype.delete.dialog.title" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage
              id="aircraft.settings.fueltype.delete.dialog.text"
              values={{ fuelType: <strong>{fuelType.description}</strong> }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} disabled={submitting}>
            <FormattedMessage id="aircraft.settings.fueltype.delete.dialog.buttons.cancel" />
          </Button>
          <DeleteButton
            onClick={onConfirm}
            color="secondary"
            variant="contained"
            label={this.props.intl.formatMessage({
              id: 'aircraft.settings.fueltype.delete.dialog.buttons.delete'
            })}
            data-cy="fuel-type-delete-button"
            disabled={submitting}
            inProgress={submitting}
          />
        </DialogActions>
      </Dialog>
    )
  }
}

DeleteFuelTypeDialog.propTypes = {
  fuelType: checkShape.isRequired,
  submitting: PropTypes.bool,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  intl: intlShape.isRequired
}

export default injectIntl(DeleteFuelTypeDialog)
