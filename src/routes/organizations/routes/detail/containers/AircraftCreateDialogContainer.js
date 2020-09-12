import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  closeCreateAircraftDialog,
  updateCreateAircraftDialogData,
  createAircraft
} from '../module'
import AircraftCreateDialog from '../components/AircraftCreateDialog'

const mapStateToProps = state => ({
  data: state.organizationDetail.createAircraftDialog.data,
  submitted: state.organizationDetail.createAircraftDialog.submitted
})

const mapActionCreators = {
  updateData: updateCreateAircraftDialogData,
  onClose: closeCreateAircraftDialog,
  onSubmit: createAircraft
}

export default compose(connect(mapStateToProps, mapActionCreators))(
  AircraftCreateDialog
)
