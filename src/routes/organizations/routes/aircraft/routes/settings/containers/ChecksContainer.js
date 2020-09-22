import { compose } from 'redux'
import { connect } from 'react-redux'
import Checks from '../components/Checks'
import { getAircraftChecks } from '../../../../../../../util/getFromState'
import { fetchChecks } from '../../../module'
import {
  openCreateCheckDialog,
  openDeleteCheckDialog,
  closeDeleteCheckDialog,
  deleteCheck
} from '../module'

const mapStateToProps = (state, ownProps) => {
  const { organizationId, aircraftId } = ownProps
  return {
    organizationId,
    aircraftId,
    checks: getAircraftChecks(state, aircraftId),
    createCheckDialogOpen: state.aircraftSettings.createCheckDialog.open,
    deleteCheckDialog: state.aircraftSettings.deleteCheckDialog
  }
}

const mapActionCreators = {
  fetchChecks,
  openCreateCheckDialog,
  openDeleteCheckDialog,
  closeDeleteCheckDialog,
  deleteCheck
}

export default compose(connect(mapStateToProps, mapActionCreators))(Checks)
