import React from 'react'
import PropTypes from 'prop-types'
import AuthInfo from './AuthInfo'

class Header extends React.Component {
  render() {
    return (
      <React.Fragment>
        {!this.props.auth.isEmpty ? (
          <React.Fragment>
            <AuthInfo username={this.props.auth.email} />
            <button onClick={() => this.props.logout()}>Logout</button>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    )
  }
}

Header.propTypes = {
  auth: PropTypes.shape({
    isEmpty: PropTypes.bool.isRequired,
    email: PropTypes.string
  }).isRequired,
  logout: PropTypes.func.isRequired
}

export default Header
