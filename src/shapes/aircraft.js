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

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  registration: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    fuelTypes,
    engineHoursCounterEnabled: PropTypes.bool
  })
})
