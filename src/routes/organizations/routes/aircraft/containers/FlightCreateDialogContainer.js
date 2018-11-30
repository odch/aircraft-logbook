import { compose } from 'redux'
import { connect } from 'react-redux'
import FlightCreateDialog from '../components/FlightCreateDialog'
import {
  closeCreateFlightDialog,
  updateCreateFlightDialogData,
  createFlight
} from '../module'

const mapStateToProps = state => {
  return {
    organizationMembers: state.firestore.ordered.organizationMembers,
    aerodromes: state.firestore.ordered.aerodromes,
    data: state.aircraft.createFlightDialogData
  }
}

const mapActionCreators = {
  onClose: closeCreateFlightDialog,
  updateData: updateCreateFlightDialogData,
  onSubmit: createFlight
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(FlightCreateDialog)
