import { compose } from 'redux'
import { connect } from 'react-redux'
import _get from 'lodash.get'
import Checks from '../components/Checks'
import { getAircraft } from '../../../../../../../util/getFromState'
import {
  openCreateCheckDialog,
  openDeleteCheckDialog,
  closeDeleteCheckDialog,
  deleteCheck
} from '../module'

const mapStateToProps = (state, ownProps) => {
  const { organizationId, aircraftId } = ownProps

  const aircraft = getAircraft(state, aircraftId)
  const checks = _get(aircraft, 'checks', [])

  return {
    organizationId,
    aircraftId,
    checks,
    createCheckDialogOpen: state.aircraftSettings.createCheckDialog.open,
    deleteCheckDialog: state.aircraftSettings.deleteCheckDialog
  }
}

const mapActionCreators = {
  openCreateCheckDialog,
  openDeleteCheckDialog,
  closeDeleteCheckDialog,
  deleteCheck
}

export default compose(connect(mapStateToProps, mapActionCreators))(Checks)
