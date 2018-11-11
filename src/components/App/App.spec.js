import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import App from './App'
import renderIntl from '../../testutil/renderIntl'

describe('components', () => {
  describe('App', () => {
    it('renders loading icon if not initialized', () => {
      const auth = {
        isLoaded: false,
        isEmpty: true
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

    it('renders child if authenticated', () => {
      const auth = {
        isLoaded: true,
        isEmpty: false,
        email: 'test@example.com'
      }
      const store = configureStore()({
        firebase: {
          auth,
          profile: {}
        }
      })
      const tree = renderIntl(
        <Provider store={store}>
          <App auth={auth}>
            <div>content</div>
          </App>
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
