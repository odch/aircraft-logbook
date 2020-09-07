import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import FlightCreateDialog from '../components/FlightCreateDialog'
import {
  closeCreateFlightDialog,
  updateCreateFlightDialogData,
  createFlight,
  openCreateAerodromeDialog
} from '../module'
import * as flightDialogUtils from '../util/flightDialogUtils'

const mapStateToProps = (state, ownProps) => {
  const { aircraftId, intl } = ownProps
  return {
    flightNatures: flightDialogUtils.flightNatures(intl),
    techlogEntryStatusOptions: flightDialogUtils.techlogEntryStatus(intl),
    loadMembers: flightDialogUtils.loadMembers(state),
    loadAerodromes: flightDialogUtils.loadAerodromes(state),
    aircraftSettings: flightDialogUtils.aircraftSettings(state, aircraftId),
    data: state.aircraft.createFlightDialog.data,
    validationErrors: state.aircraft.createFlightDialog.validationErrors,
    submitting: state.aircraft.createFlightDialog.submitting,
    initialData: state.aircraft.createFlightDialog.initialData,
    createAerodromeDialogOpen: state.aircraft.createAerodromeDialog.open
  }
}

const mapActionCreators = {
  onClose: closeCreateFlightDialog,
  updateData: updateCreateFlightDialogData,
  onSubmit: createFlight,
  openCreateAerodromeDialog
}

export default injectIntl(
  compose(connect(mapStateToProps, mapActionCreators))(FlightCreateDialog)
)
