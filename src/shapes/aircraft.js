import PropTypes from 'prop-types'

export const fuelTypes = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  })
)

export const check = PropTypes.shape({
  description: PropTypes.string.isRequired,
  dateLimit: PropTypes.object,
  counterLimit: PropTypes.number,
  counterReference: PropTypes.string
})

export const counters = PropTypes.shape({
  flights: PropTypes.number.isRequired,
  flightHours: PropTypes.number.isRequired,
  landings: PropTypes.number.isRequired,
  engineHours: PropTypes.number
})

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  registration: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    fuelTypes,
    engineHoursCounterEnabled: PropTypes.bool,
    techlogEnabled: PropTypes.bool
  }).isRequired,
  checks: PropTypes.arrayOf(check),
  counters
})
