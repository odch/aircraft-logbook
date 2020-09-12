import { compose } from 'redux'
import { connect } from 'react-redux'
import _get from 'lodash.get'
import { getAircraft } from '../../../../../../../util/getFromState'
import AdvancedSettings from '../components/AdvancedSettings'
import { updateSetting } from '../module'

const mapStateToProps = (state, ownProps) => {
  const { organizationId, aircraftId } = ownProps

  const aircraft = getAircraft(state, aircraftId)
  const techlogEnabled = _get(aircraft, 'settings.techlogEnabled', false)
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
    organizationId,
    aircraftId,
    settings: {
      techlogEnabled,
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
