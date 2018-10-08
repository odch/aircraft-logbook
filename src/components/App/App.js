import React from 'react'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import StartPage from '../StartPage'
import LoginPage from '../../containers/LoginPageContainer'
import RegistrationPage from '../../containers/RegistrationPageContainer'
import ProtectedRoute from '../ProtectedRoute'
import LoadingIcon from './LoadingIcon'

class App extends React.Component {
  render() {
    if (!this.props.auth.isLoaded) {
      return <LoadingIcon />
    }

    return (
      <Router>
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={StartPage}
            authed={!this.props.auth.isEmpty}
          />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegistrationPage} />
          <Redirect to="/" />
        </Switch>
      </Router>
    )
  }
}

App.propTypes = {
  auth: PropTypes.shape({
    isLoaded: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired
  })
}

export default App
