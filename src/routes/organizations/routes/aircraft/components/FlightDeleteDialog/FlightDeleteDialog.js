import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DeleteButton from '../../../../../../components/DeleteButton'
import {
  aircraft as aircraftShape,
  flight as flightShape
} from '../../../../../../shapes'
import { formatDate, formatTime } from '../../../../../../util/dates'

const FlightAttribute = props => (
  <DialogContentText>
    <FormattedMessage id={`flight.delete.dialog.${props.label}`} />
    :&nbsp;
    {props.value}
  </DialogContentText>
)

FlightAttribute.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

const styles = {
  attributesWrapper: {
    marginTop: '1em'
  }
}

class FlightDeleteDialog extends React.Component {
  handleClose = () => {
    if (!this.props.submitted && this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    const { flight, submitted, classes, onConfirm } = this.props
    return (
      <Dialog onClose={this.handleClose} data-cy="flight-delete-dialog" open>
        <DialogTitle>
          <FormattedMessage id="flight.delete.dialog.title" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage id="flight.delete.dialog.text" />
          </DialogContentText>
          <div className={classes.attributesWrapper}>
            <FlightAttribute
              label="date"
              value={formatDate(flight.blockOffTime)}
            />
            <FlightAttribute
              label="pilot"
              value={`${flight.pilot.firstname} ${flight.pilot.lastname}`}
            />
            <FlightAttribute
              label="departureaerodrome"
              value={flight.departureAerodrome.name}
            />
            <FlightAttribute
              label="destinationaerodrome"
              value={flight.destinationAerodrome.name}
            />
            <FlightAttribute
              label="blockofftime"
              value={formatTime(flight.blockOffTime)}
            />
            <FlightAttribute
              label="blockontime"
              value={formatTime(flight.blockOnTime)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} disabled={submitted}>
            <FormattedMessage id="flight.delete.dialog.buttons.cancel" />
          </Button>
          <DeleteButton
            onClick={onConfirm}
            color="secondary"
            variant="contained"
            label={this.props.intl.formatMessage({
              id: 'flight.delete.dialog.buttons.delete'
            })}
            data-cy="flight-delete-button"
            disabled={submitted}
            inProgress={submitted}
          />
        </DialogActions>
      </Dialog>
    )
  }
}

FlightDeleteDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraft: aircraftShape.isRequired,
  flight: flightShape.isRequired,
  submitted: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  intl: intlShape
}

export default withStyles(styles)(injectIntl(FlightDeleteDialog))
