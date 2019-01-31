import { compose } from 'redux'
import { connect } from 'react-redux'
import _get from 'lodash.get'
import FuelTypes from '../components/FuelTypes'
import { getAircraft } from '../../../../../../../util/getFromState'

const mapStateToProps = (state, ownProps) => {
  const { aircraftId } = ownProps

  const aircraft = getAircraft(state, aircraftId)
  const fuelTypes = _get(aircraft, 'settings.fuelTypes', [])

  return {
    types: fuelTypes
  }
}

const mapActionCreators = {}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(FuelTypes)
