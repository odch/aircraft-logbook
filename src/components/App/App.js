import React from 'react'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import StartPage from '../StartPage'
import OrganizationsPage from '../OrganizationsPage'
import OrganizationPage from '../OrganizationPage'
import LoginPage from '../../containers/LoginPageContainer'
import RegistrationPage from '../../containers/RegistrationPageContainer'
import ProtectedRoute from '../ProtectedRoute'
import LoadingIcon from './LoadingIcon'

class App extends React.Component {
  componentDidMount() {
    this.props.watchOrganizations()
  }

  componentWillUnmount() {
    this.props.unwatchOrganizations()
  }

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
          <ProtectedRoute
            exact
            path="/organizations"
            component={OrganizationsPage}
            authed={!this.props.auth.isEmpty}
          />
          <ProtectedRoute
            exact
            path="/organizations/:organizationId"
            component={OrganizationPage}
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
  }),
  watchOrganizations: PropTypes.func.isRequired,
  unwatchOrganizations: PropTypes.func.isRequired
}

export default App
