import PropTypes from 'prop-types'

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  nr: PropTypes.string,
  inviteEmail: PropTypes.string,
  roles: PropTypes.arrayOf(PropTypes.string),
  user: PropTypes.object
})
