import React from 'react'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import LoginForm from '../../containers/LoginFormContainer'
import StartPage from '../StartPage'

class App extends React.Component {
  render() {
    if (this.props.auth.isEmpty === true) {
      return <LoginForm />
    }

    return (
      <Router>
        <Switch>
          <Route exact path="/" component={StartPage} />
          <Redirect to="/" />
        </Switch>
      </Router>
    )
  }
}

App.propTypes = {
  auth: PropTypes.shape({
    isEmpty: PropTypes.bool.isRequired
  })
}

export default App
