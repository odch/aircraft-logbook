import PropTypes from 'prop-types'

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  pilot: PropTypes.object.isRequired,
  blockOffTime: PropTypes.object.isRequired,
  takeOffTime: PropTypes.object.isRequired,
  landingTime: PropTypes.object.isRequired,
  blockOnTime: PropTypes.object.isRequired,
  departureAerodrome: PropTypes.object.isRequired,
  destinationAerodrome: PropTypes.object.isRequired
})
