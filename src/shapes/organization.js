import PropTypes from 'prop-types'

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  lockDate: PropTypes.object,
  readonlyAccessEnabled: PropTypes.bool,
  readonlyAccessToken: PropTypes.string,
  readonly: PropTypes.bool, // (for ramp check view) will be removed once all regular users have at least the 'pilot' role
  limits: PropTypes.shape({
    aircrafts: PropTypes.number,
    members: PropTypes.number
  })
})
