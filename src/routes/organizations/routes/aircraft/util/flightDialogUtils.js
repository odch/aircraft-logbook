import { getFlightNatures } from '../../../../../util/flightNatures'
import { getOpenTechlogStatus } from '../../../../../util/techlogStatus'
import { getAircraft } from '../../../../../util/getFromState'
import {
  getAerodromeOption,
  getMemberOption,
  getFuelTypeOption
} from './getOptions'

export const flightNatures = intl =>
  getFlightNatures().map(nature => ({
    value: nature,
    label: intl.formatMessage({ id: `flight.nature.${nature}` })
  }))

export const techlogEntryStatus = intl =>
  getOpenTechlogStatus().map(status => ({
    value: status.id,
    label: intl.formatMessage({ id: `techlog.entry.status.${status.id}` })
  }))

export const aircraftSettings = (state, aircraftId) => {
  const aircraftSettings = getAircraft(state, aircraftId).settings
  if (aircraftSettings) {
    const fuelTypes = aircraftSettings.fuelTypes || []
    const fuelTypeOptions = fuelTypes.map(fuelType =>
      getFuelTypeOption(fuelType)
    )
    return {
      fuelTypes: fuelTypeOptions,
      engineHoursCounterEnabled:
        aircraftSettings.engineHoursCounterEnabled === true,
      techlogEnabled: aircraftSettings.techlogEnabled === true
    }
  }
}

const filterMembers = (state, input, instructorsOnly) => {
  const members = state.firestore.ordered.organizationMembers

  input = input.toLowerCase()

  return members
    .filter(member => {
      if (instructorsOnly === true && member.instructor !== true) {
        return false
      }
      if (member.firstname && member.firstname.toLowerCase().includes(input)) {
        return true
      }
      if (member.lastname && member.lastname.toLowerCase().includes(input)) {
        return true
      }
      return !!(member.nr && member.nr.toLowerCase().includes(input))
    })
    .map(getMemberOption)
}

export const loadMembers = state => (input, callback) => {
  callback(filterMembers(state, input, false))
}

export const loadInstructors = state => (input, callback) => {
  callback(filterMembers(state, input, true))
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
