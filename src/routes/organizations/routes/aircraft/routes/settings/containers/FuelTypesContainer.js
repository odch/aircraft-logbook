import { compose } from 'redux'
import { connect } from 'react-redux'
import _get from 'lodash.get'
import FuelTypes from '../components/FuelTypes'
import { getAircraft } from '../../../../../../../util/getFromState'
import { openCreateFuelTypeDialog } from '../module'

const mapStateToProps = (state, ownProps) => {
  const { organizationId, aircraftId } = ownProps

  const aircraft = getAircraft(state, aircraftId)
  const fuelTypes = _get(aircraft, 'settings.fuelTypes', [])

  return {
    organizationId,
    aircraftId,
    types: fuelTypes,
    createFuelTypeDialogOpen: state.aircraftSettings.createFuelTypeDialog.open
  }
}

const mapActionCreators = {
  openCreateFuelTypeDialog
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(FuelTypes)
