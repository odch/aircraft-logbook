import React from 'react'
import PropTypes from 'prop-types'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import EntryStatus from './EntryStatus'

const StatusTransition = ({ before, after }) => (
  <div>
    <EntryStatus id={before} small />
    <ArrowForwardIcon />
    <EntryStatus id={after} small />
  </div>
)

StatusTransition.propTypes = {
  before: PropTypes.string.isRequired,
  after: PropTypes.string.isRequired
}

export default StatusTransition
