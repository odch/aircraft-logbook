import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import App from './App'
import configureStore from 'redux-mock-store'

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
      const tree = renderer
        .create(
          <Provider store={store}>
            <App auth={auth} />
          </Provider>
        )
        .toJSON()
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
      const tree = renderer
        .create(
          <Provider store={store}>
            <App auth={auth} />
          </Provider>
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
