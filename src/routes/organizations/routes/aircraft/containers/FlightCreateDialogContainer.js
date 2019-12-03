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
import { getAerodromeOption, getMemberOption } from '../util/getOptions'

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

export const loadMembers = state => (input, callback) => {
  const members = state.firestore.ordered.organizationMembers

  input = input.toLowerCase()

  const result = members
    .filter(member => {
      if (member.firstname && member.firstname.toLowerCase().includes(input)) {
        return true
      }
      if (member.lastname && member.lastname.toLowerCase().includes(input)) {
        return true
      }
      return !!(member.nr && member.nr.toLowerCase().includes(input))
    })
    .map(getMemberOption)

  callback(result)
}

export const loadAerodromes = state => (input, callback) => {
  const mainAerodromes = state.firestore.ordered.allAerodromes
  const organizationAerodromes = state.firestore.ordered.organizationAerodromes

  input = input.toLowerCase()

  const merged = [...mainAerodromes, ...organizationAerodromes]
  const result = merged
    .filter(aerodrome => {
      if (aerodrome.name && aerodrome.name.toLowerCase().includes(input)) {
        return true
      }
      return !!(
        aerodrome.identification &&
        aerodrome.identification.toLowerCase().includes(input)
      )
    })
    .sort((a, b) => {
      let cmp = a.name.localeCompare(b.name)
      if (cmp === 0) {
        cmp = a.identification.localeCompare(b.identification)
      }
      return cmp
    })
    .map(getAerodromeOption)

  callback(result)
}

const mapStateToProps = (state, ownProps) => {
  const { aircraftId, intl } = ownProps
  return {
    flightNatures: flightNatures(intl),
    loadMembers: loadMembers(state),
    loadAerodromes: loadAerodromes(state),
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
