import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import renderer from 'react-test-renderer'
import renderIntl from '../../../../testutil/renderIntl'
import configureStore from 'redux-mock-store'
import LoginPage from './LoginPage'

const StartPage = () => <div>start page</div>

describe('components', () => {
  describe('LoginPage', () => {
    it('redirects to start page if authenticated', () => {
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
                <LoginPage auth={auth} />
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
      const store = configureStore()({
        firebase: {
          auth
        },
        login: {
          username: 'test@example.com',
          password: 'mypassword',
          failed: false,
          submitted: false
        }
      })
      const tree = renderIntl(
        <Provider store={store}>
          <Router>
            <Switch>
              <LoginPage auth={auth} />
              <Route exact path="/" component={StartPage} />
            </Switch>
          </Router>
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
