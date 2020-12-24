import PropTypes from 'prop-types'

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  pilot: PropTypes.object.isRequired,
  blockOffTime: PropTypes.object.isRequired,
  takeOffTime: PropTypes.object,
  landingTime: PropTypes.object,
  blockOnTime: PropTypes.object,
  departureAerodrome: PropTypes.object.isRequired,
  destinationAerodrome: PropTypes.object
})
