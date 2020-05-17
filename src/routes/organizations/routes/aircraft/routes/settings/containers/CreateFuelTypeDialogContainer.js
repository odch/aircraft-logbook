import { compose } from 'redux'
import { connect } from 'react-redux'
import CreateFuelTypeDialog from '../components/CreateFuelTypeDialog'
import {
  closeCreateFuelTypeDialog,
  updateCreateFuelTypeDialogData,
  createFuelType
} from '../module'

const mapStateToProps = (state, ownProps) => ({
  organizationId: ownProps.organizationId,
  aircraftId: ownProps.aircraftId,
  data: state.aircraftSettings.createFuelTypeDialog.data,
  submitting: state.aircraftSettings.createFuelTypeDialog.submitting
})

const mapActionCreators = {
  onClose: closeCreateFuelTypeDialog,
  updateData: updateCreateFuelTypeDialogData,
  onSubmit: createFuelType
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(CreateFuelTypeDialog)
