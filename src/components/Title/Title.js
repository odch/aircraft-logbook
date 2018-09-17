import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

const Title = props => (
  <Typography variant="title" align="center">
    {props.text}
  </Typography>
)

Title.propTypes = {
  text: PropTypes.string.isRequired
}

export default Title
