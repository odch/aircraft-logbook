import { compose } from 'redux'
import { connect } from 'react-redux'
import CreateCheckDialog from '../components/CreateCheckDialog'
import {
  closeCreateCheckDialog,
  updateCreateCheckDialogData,
  createCheck
} from '../module'
import { getAircraft } from '../../../../../../../util/getFromState'
import { injectIntl } from 'react-intl'

const counterLabel = (intl, name) =>
  intl.formatMessage({ id: `aircraft.counter.${name}` })

const counters = (state, aircraftId, intl) => {
  const aircraftSettings = getAircraft(state, aircraftId).settings
  return [
    {
      value: 'flightHours',
      label: counterLabel(intl, 'flighthours')
    },
    ...(aircraftSettings && aircraftSettings.engineHoursCounterEnabled === true
      ? [
          {
            value: 'engineHours',
            label: counterLabel(intl, 'enginehours')
          }
        ]
      : []),
    {
      value: 'landings',
      label: counterLabel(intl, 'landings')
    }
  ]
}

const mapStateToProps = (state, ownProps) => ({
  organizationId: ownProps.organizationId,
  aircraftId: ownProps.aircraftId,
  data: state.aircraftSettings.createCheckDialog.data,
  submitting: state.aircraftSettings.createCheckDialog.submitting,
  valid: state.aircraftSettings.createCheckDialog.valid,
  counters: counters(state, ownProps.aircraftId, ownProps.intl)
})

const mapActionCreators = {
  onClose: closeCreateCheckDialog,
  updateData: updateCreateCheckDialogData,
  onSubmit: createCheck
}

export default injectIntl(
  compose(connect(mapStateToProps, mapActionCreators))(CreateCheckDialog)
)
