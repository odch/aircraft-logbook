import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import App from './App'
import renderIntl from '../../testutil/renderIntl'

describe('components', () => {
  describe('App', () => {
    it('renders login form if not authenticated', () => {
      const store = configureStore()({
        app: {
          login: {
            username: '',
            password: '',
            failed: false,
            submitted: false
          }
        }
      })
      const auth = {
        isEmpty: true
      }
      const tree = renderIntl(
        <Provider store={store}>
          <App auth={auth} />
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders app if authenticated', () => {
      const auth = {
        isEmpty: false,
        email: 'test@example.com'
      }
      const store = configureStore()({
        firebase: {
          auth
        }
      })
      const tree = renderIntl(
        <Provider store={store}>
          <App auth={auth} />
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
