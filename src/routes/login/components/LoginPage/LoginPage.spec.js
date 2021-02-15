import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import renderer from 'react-test-renderer'
import renderIntl from '../../../../testutil/renderIntl'
import configureStore from 'redux-mock-store'
import LoginPage from './LoginPage'

const StartPage = () => <div>start page</div>
const OrgDetailPage = () => <div>org detail page</div>

describe('components', () => {
  describe('LoginPage', () => {
    it('redirects to from state if authenticated', () => {
      const router = {
        location: {
          state: {
            from: {
              pathname: '/organizations/foobar'
            }
          }
        }
      }
      const auth = {
        isEmpty: false
      }
      const store = configureStore()({
        firebase: {
          auth
        }
      })
      const tree = renderer
        .create(
          <Provider store={store}>
            <Router>
              <Switch>
                <Route
                  exact
                  path="/organizations/foobar"
                  component={OrgDetailPage}
                />
                <LoginPage auth={auth} router={router} />
              </Switch>
            </Router>
          </Provider>
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('redirects to start page as default if authenticated', () => {
      const router = {
        location: {}
      }
      const auth = {
        isEmpty: false
      }
      const store = configureStore()({
        firebase: {
          auth
        }
      })
      const tree = renderer
        .create(
          <Provider store={store}>
            <Router>
              <Switch>
                <Route exact path="/" component={StartPage} />
                <LoginPage auth={auth} router={router} />
              </Switch>
            </Router>
          </Provider>
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders login form if not authenticated', () => {
      const auth = {
        isEmpty: true
      }
      const tokenLogin = {
        submitted: false,
        failed: false
      }
      const store = configureStore()({
        firebase: {
          auth
        },
        login: {
          username: 'test@example.com',
          password: 'mypassword',
          failed: false,
          submitted: false,
          googleLogin: {
            failed: false
          },
          tokenLogin
        }
      })
      const router = {
        location: {}
      }
      const tree = renderIntl(
        <Provider store={store}>
          <Router>
            <Switch>
              <LoginPage auth={auth} tokenLogin={tokenLogin} router={router} />
              <Route exact path="/" component={StartPage} />
            </Switch>
          </Router>
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
