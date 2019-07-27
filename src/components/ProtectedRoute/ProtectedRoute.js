import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const ProtectedRoute = ({ render, protect, authed, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (!protect || authed === true) {
        return render(props)
      }
      return (
        <Redirect
          to={{ pathname: '/login', state: { from: props.location } }}
        />
      )
    }}
  />
)

ProtectedRoute.propTypes = {
  render: PropTypes.func.isRequired,
  protect: PropTypes.bool,
  authed: PropTypes.bool.isRequired,
  location: PropTypes.string
}

const mapStateToProps = state => ({
  authed: !state.firebase.auth.isEmpty
})

const mapActionCreators = {}

export default connect(
  mapStateToProps,
  mapActionCreators
)(ProtectedRoute)
