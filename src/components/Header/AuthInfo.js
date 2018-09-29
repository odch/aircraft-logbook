import React from 'react'
import PropTypes from 'prop-types'

const AuthInfo = props => <div data-cy="username">{props.username}</div>

AuthInfo.propTypes = {
  username: PropTypes.string.isRequired
}

export default AuthInfo
