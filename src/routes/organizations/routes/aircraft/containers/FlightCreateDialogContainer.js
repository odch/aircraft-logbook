import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { getFlightNatures } from '../../../../../util/flightNatures'
import FlightCreateDialog from '../components/FlightCreateDialog'
import {
  closeCreateFlightDialog,
  updateCreateFlightDialogData,
  createFlight
} from '../module'
import { getAircraft } from '../../../../../util/getFromState'

const flightNatures = intl =>
  getFlightNatures().map(nature => ({
    value: nature,
    label: intl.formatMessage({ id: `flight.nature.${nature}` })
  }))

const fuelTypes = (state, aircraftId) => {
  const aircraftSettings = getAircraft(state, aircraftId).settings
  if (aircraftSettings) {
    const fuelTypes = aircraftSettings.fuelTypes || []
    return fuelTypes.map(fuelType => ({
      value: fuelType.name,
      label: fuelType.description || fuelType.name
    }))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { aircraftId, intl } = ownProps
  return {
    organizationMembers: state.firestore.ordered.organizationMembers,
    flightNatures: flightNatures(intl),
    aerodromes: state.firestore.ordered.aerodromes,
    fuelTypes: fuelTypes(state, aircraftId),
    data: state.aircraft.createFlightDialog.data,
    validationErrors: state.aircraft.createFlightDialog.validationErrors,
    submitting: state.aircraft.createFlightDialog.submitting
  }
}

const mapActionCreators = {
  onClose: closeCreateFlightDialog,
  updateData: updateCreateFlightDialogData,
  onSubmit: createFlight
}

export default injectIntl(
  compose(
    connect(
      mapStateToProps,
      mapActionCreators
    )
  )(FlightCreateDialog)
)
