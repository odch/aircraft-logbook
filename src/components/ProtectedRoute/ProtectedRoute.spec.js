import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import renderer from 'react-test-renderer'
import configureStore from 'redux-mock-store'
import ProtectedRoute from './ProtectedRoute'

const WrappedComponent = () => <div>wrapped</div>

const LoginPage = () => <div>Login page</div>

describe('components', () => {
  describe('ProtectedRoute', () => {
    it('renders component if authenticated', () => {
      const store = configureStore()({
        firebase: {
          auth: {
            isEmpty: false
          }
        }
      })

      const tree = renderer
        .create(
          <Provider store={store}>
            <Router>
              <ProtectedRoute protect render={() => <WrappedComponent />} />
            </Router>
          </Provider>
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('redirects to login page if not authenticated', () => {
      const store = configureStore()({
        firebase: {
          auth: {
            isEmpty: true
          }
        }
      })

      const tree = renderer
        .create(
          <Provider store={store}>
            <Router>
              <Switch>
                <Route exact path="/login" component={LoginPage} />
                <ProtectedRoute protect render={() => <WrappedComponent />} />
              </Switch>
            </Router>
          </Provider>
        )
        .toJSON()

      expect(tree).toMatchSnapshot()
    })
  })
})
