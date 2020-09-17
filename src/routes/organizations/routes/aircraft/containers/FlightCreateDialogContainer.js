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
  const {
    initialData,
    data,
    submitting,
    validationErrors,
    visibleFields,
    editableFields
  } = state.aircraft.createFlightDialog
  return {
    flightNatures: flightDialogUtils.flightNatures(intl),
    techlogEntryStatusOptions: flightDialogUtils.techlogEntryStatus(intl),
    loadMembers: flightDialogUtils.loadMembers(state),
    loadInstructors: flightDialogUtils.loadInstructors(state),
    loadAerodromes: flightDialogUtils.loadAerodromes(state),
    aircraftSettings: flightDialogUtils.aircraftSettings(state, aircraftId),
    createAerodromeDialogOpen: state.aircraft.createAerodromeDialog.open,
    data,
    validationErrors,
    submitting,
    initialData,
    visibleFields,
    editableFields
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
