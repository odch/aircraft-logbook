import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import renderer from 'react-test-renderer'
import renderIntl from '../../../../testutil/renderIntl'
import configureStore from 'redux-mock-store'
import RegistrationPage from './RegistrationPage'

const StartPage = () => <div>start page</div>

describe('components', () => {
  describe('RegistrationPage', () => {
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
                <RegistrationPage auth={auth} />
              </Switch>
            </Router>
          </Provider>
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders registration form if not authenticated', () => {
      const auth = {
        isEmpty: true
      }
      const store = configureStore()({
        firebase: {
          auth
        },
        registration: {
          data: {
            firstname: 'Max',
            lastname: 'Muster',
            email: 'test@example.com',
            password: 'mypassword'
          },
          failed: false,
          submitted: false
        }
      })
      const tree = renderIntl(
        <Provider store={store}>
          <Router>
            <Switch>
              <RegistrationPage auth={auth} />
              <Route exact path="/" component={StartPage} />
            </Switch>
          </Router>
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
