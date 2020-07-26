import PropTypes from 'prop-types'

export const actionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
})

export const attachmentShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  originalName: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired
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
  attachments: PropTypes.arrayOf(attachmentShape),
  actions: PropTypes.arrayOf(actionShape)
})
