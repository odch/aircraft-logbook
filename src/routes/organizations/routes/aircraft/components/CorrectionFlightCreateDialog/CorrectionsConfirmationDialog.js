import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { intl as intlShape } from '../../../../../../shapes'
import { renderCorrectionSets } from '../../util/formatUtils'

const CorrectionsConfirmationDialog = ({
  corrections,
  aircraftSettings,
  intl,
  onClose,
  onSubmit
}) => (
  <Dialog onClose={onClose} open>
    <DialogTitle>
      <FormattedMessage id="correctionflight.create.dialog.confirmation.title" />
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        <FormattedMessage id="correctionflight.create.dialog.confirmation.text" />
      </DialogContentText>
      {renderCorrectionSets(
        corrections,
        [
          {
            name: 'aerodrome',
            label: 'aerodrome'
          },
          {
            name: 'flightHours',
            label: 'flighthours',
            type: 'decimal'
          },
          {
            name: 'flightTimeCounter',
            label: 'flighthours_counter',
            type: 'decimal'
          },
          {
            name: 'landings',
            label: 'landings'
          },
          {
            name: 'engineHours',
            label: 'enginehours',
            type: 'decimal',
            fractionDigits: aircraftSettings.engineHoursCounterFractionDigits
          },
          {
            name: 'engineTimeCounter',
            label: 'enginetimecounter',
            type: 'decimal',
            fractionDigits: aircraftSettings.engineHoursCounterFractionDigits
          },
          {
            name: 'engineTachHours',
            label: 'enginetachhours',
            type: 'decimal',
            fractionDigits:
              aircraftSettings.engineTachHoursCounterFractionDigits
          },
          {
            name: 'engineTachCounter',
            label: 'enginetachcounter',
            type: 'decimal',
            fractionDigits:
              aircraftSettings.engineTachHoursCounterFractionDigits
          }
        ],
        intl
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        <FormattedMessage id="correctionflight.create.dialog.buttons.cancel" />
      </Button>
      <Button onClick={onSubmit} color="primary" variant="contained">
        <FormattedMessage id="correctionflight.create.dialog.buttons.create" />
      </Button>
    </DialogActions>
  </Dialog>
)

CorrectionsConfirmationDialog.propTypes = {
  corrections: PropTypes.objectOf(
    PropTypes.shape({
      start: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      end: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
    })
  ).isRequired,
  aircraftSettings: PropTypes.shape({
    engineHoursCounterFractionDigits: PropTypes.oneOf([1, 2]),
    engineTachHoursCounterFractionDigits: PropTypes.oneOf([1, 2])
  }).isRequired,
  intl: intlShape.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
}

export default injectIntl(CorrectionsConfirmationDialog)
