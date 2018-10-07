import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import renderer from 'react-test-renderer'
import ProtectedRoute from './ProtectedRoute'

const WrappedComponent = () => <div>wrapped</div>

const LoginPage = () => <div>Login page</div>

describe('components', () => {
  describe('ProtectedRoute', () => {
    it('renders component if authenticated', () => {
      const tree = renderer
        .create(
          <Router>
            <ProtectedRoute authed={true} component={WrappedComponent} />
          </Router>
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('redirects to login page if not authenticated', () => {
      expect(tree).toMatchSnapshot()
    })
    const tree = renderer
      .create(
        <Router>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <ProtectedRoute authed={false} component={WrappedComponent} />
          </Switch>
        </Router>
      )
      .toJSON()
  })
})
