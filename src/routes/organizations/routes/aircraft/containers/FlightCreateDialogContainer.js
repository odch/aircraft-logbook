import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { getFlightNatures } from '../../../../../util/flightNatures'
import FlightCreateDialog from '../components/FlightCreateDialog'
import {
  closeCreateFlightDialog,
  updateCreateFlightDialogData,
  createFlight,
  openCreateAerodromeDialog
} from '../module'
import { getAircraft } from '../../../../../util/getFromState'

const flightNatures = intl =>
  getFlightNatures().map(nature => ({
    value: nature,
    label: intl.formatMessage({ id: `flight.nature.${nature}` })
  }))

const aircraftSettings = (state, aircraftId) => {
  const aircraftSettings = getAircraft(state, aircraftId).settings
  if (aircraftSettings) {
    const fuelTypes = aircraftSettings.fuelTypes || []
    const fuelTypeOptions = fuelTypes.map(fuelType => ({
      value: fuelType.name,
      label: fuelType.description || fuelType.name
    }))
    return {
      fuelTypes: fuelTypeOptions,
      engineHoursCounterEnabled:
        aircraftSettings.engineHoursCounterEnabled === true
    }
  }
}

const aerodromes = state => {
  const mainAerodromes = state.firestore.ordered.allAerodromes
  const organizationAerodromes = state.firestore.ordered.organizationAerodromes

  const merged = [...mainAerodromes, ...organizationAerodromes]
  return merged.sort((a, b) => {
    let cmp = a.name.localeCompare(b.name)
    if (cmp === 0) {
      cmp = a.identification.localeCompare(b.identification)
    }
    return cmp
  })
}

const mapStateToProps = (state, ownProps) => {
  const { aircraftId, intl } = ownProps
  return {
    organizationMembers: state.firestore.ordered.organizationMembers,
    flightNatures: flightNatures(intl),
    aerodromes: aerodromes(state),
    aircraftSettings: aircraftSettings(state, aircraftId),
    data: state.aircraft.createFlightDialog.data,
    validationErrors: state.aircraft.createFlightDialog.validationErrors,
    submitting: state.aircraft.createFlightDialog.submitting,
    initialData: state.aircraft.createFlightDialog.initialData,
    createAerodromeDialogOpen: state.aircraft.createAerodromeDialog.open
  }
}

const mapActionCreators = {
  onClose: closeCreateFlightDialog,
  updateData: updateCreateFlightDialogData,
  onSubmit: createFlight,
  openCreateAerodromeDialog
}

export default injectIntl(
  compose(
    connect(
      mapStateToProps,
      mapActionCreators
    )
  )(FlightCreateDialog)
)
