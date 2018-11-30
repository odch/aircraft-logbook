import PropTypes from 'prop-types'

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  identification: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired
})
