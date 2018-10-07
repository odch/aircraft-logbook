import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import LoginForm from '../../containers/LoginFormContainer'

class LoginPage extends React.Component {
  render() {
    if (!this.props.auth.isEmpty) {
      return <Redirect to="/" />
    }

    return (
      <React.Fragment>
        <LoginForm />
      </React.Fragment>
    )
  }
}

LoginPage.propTypes = {
  auth: PropTypes.shape({
    isEmpty: PropTypes.bool.isRequired
  })
}

export default LoginPage
