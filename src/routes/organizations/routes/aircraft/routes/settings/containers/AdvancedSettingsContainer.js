import { compose } from 'redux'
import { connect } from 'react-redux'
import _get from 'lodash.get'
import { getAircraft } from '../../../../../../../util/getFromState'
import AdvancedSettings from '../components/AdvancedSettings'
import { updateSetting } from '../module'

const mapStateToProps = (state, ownProps) => {
  const { aircraftId } = ownProps

  const aircraft = getAircraft(state, aircraftId)
  const techlogEnabled = _get(aircraft, 'settings.techlogEnabled', false)
  const flightTimeCounterEnabled = _get(
    aircraft,
    'settings.flightTimeCounterEnabled',
    false
  )
  const flightTimeCounterFractionDigits = _get(
    aircraft,
    'settings.flightTimeCounterFractionDigits',
    2
  )
  const engineHoursCounterEnabled = _get(
    aircraft,
    'settings.engineHoursCounterEnabled',
    false
  )
  const engineHoursCounterFractionDigits = _get(
    aircraft,
    'settings.engineHoursCounterFractionDigits',
    2
  )

  return {
    settings: {
      techlogEnabled,
      flightTimeCounterEnabled,
      flightTimeCounterFractionDigits,
      engineHoursCounterEnabled,
      engineHoursCounterFractionDigits
    },
    submitting: state.aircraftSettings.advancedSettings.submitting
  }
}

const mapActionCreators = {
  updateSetting
}

export default compose(connect(mapStateToProps, mapActionCreators))(
  AdvancedSettings
)
