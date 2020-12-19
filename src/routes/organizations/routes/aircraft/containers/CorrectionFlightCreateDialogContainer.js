import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import CorrectionFlightCreateDialog from '../components/CorrectionFlightCreateDialog'
import {
  closeCreateCorrectionFlightDialog,
  updateCreateCorrectionFlightDialogData,
  createCorrectionFlight,
  setCorrectionFlightCorrections
} from '../module'
import * as flightDialogUtils from '../util/flightDialogUtils'

const mapStateToProps = (state, ownProps) => {
  const { aircraftId } = ownProps
  const {
    initialData,
    data,
    submitting,
    corrections,
    validationErrors
  } = state.aircraft.createCorrectionFlightDialog
  return {
    loadMembers: flightDialogUtils.loadMembers(state),
    loadAerodromes: flightDialogUtils.loadAerodromes(state),
    aircraftSettings: flightDialogUtils.aircraftSettings(state, aircraftId),
    data,
    corrections,
    validationErrors,
    submitting,
    initialData
  }
}

const mapActionCreators = {
  onClose: closeCreateCorrectionFlightDialog,
  updateData: updateCreateCorrectionFlightDialogData,
  onSubmit: createCorrectionFlight,
  onCloseEnterCorrectionsAlert: setCorrectionFlightCorrections.bind(null, null),
  onCloseCorrectionsConfirmationDialog: setCorrectionFlightCorrections.bind(
    null,
    null
  )
}

export default injectIntl(
  compose(connect(mapStateToProps, mapActionCreators))(
    CorrectionFlightCreateDialog
  )
)
