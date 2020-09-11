import { compose } from 'redux'
import { connect } from 'react-redux'
import _get from 'lodash.get'
import FuelTypes from '../components/FuelTypes'
import { getAircraft } from '../../../../../../../util/getFromState'
import {
  openCreateFuelTypeDialog,
  openDeleteFuelTypeDialog,
  closeDeleteFuelTypeDialog,
  deleteFuelType
} from '../module'

const mapStateToProps = (state, ownProps) => {
  const { organizationId, aircraftId } = ownProps

  const aircraft = getAircraft(state, aircraftId)
  const fuelTypes = _get(aircraft, 'settings.fuelTypes', [])

  return {
    organizationId,
    aircraftId,
    types: fuelTypes,
    createFuelTypeDialogOpen: state.aircraftSettings.createFuelTypeDialog.open,
    deleteFuelTypeDialog: state.aircraftSettings.deleteFuelTypeDialog
  }
}

const mapActionCreators = {
  openCreateFuelTypeDialog,
  openDeleteFuelTypeDialog,
  closeDeleteFuelTypeDialog,
  deleteFuelType
}

export default compose(connect(mapStateToProps, mapActionCreators))(FuelTypes)
