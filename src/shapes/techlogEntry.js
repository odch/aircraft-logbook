import PropTypes from 'prop-types'

export const actionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
})

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  initialStatus: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
  author: PropTypes.shape({
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired
  }).isRequired,
  actions: PropTypes.arrayOf(actionShape)
})
