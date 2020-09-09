import PropTypes from 'prop-types'

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired
})
