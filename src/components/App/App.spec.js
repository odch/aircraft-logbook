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
          <App auth={auth} watchAerodromes={() => {}} />
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
          <App auth={auth} watchAerodromes={() => {}}>
            <div>content</div>
          </App>
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    const testWatchAerodromes = (auth, expectCall) => {
      const store = configureStore()({
        firebase: {
          auth
        }
      })

      const watchAerodromes = jest.fn()

      renderIntl(
        <Provider store={store}>
          <App auth={auth} watchAerodromes={watchAerodromes}>
            <div>content</div>
          </App>
        </Provider>
      )

      if (expectCall) {
        expect(watchAerodromes).toBeCalled()
      } else {
        expect(watchAerodromes).not.toBeCalled()
      }
    }

    it('calls watchAerodromes when mounted and logged in', () => {
      const auth = {
        isLoaded: true,
        isEmpty: false
      }
      testWatchAerodromes(auth, true)
    })

    it('does not watchAerodromes when mounted and auth loaded but empty', () => {
      const auth = {
        isLoaded: true,
        isEmpty: true
      }
      testWatchAerodromes(auth, false)
    })

    it('does not watchAerodromes when auth not loaded', () => {
      const auth = {
        isLoaded: false,
        isEmpty: true
      }
      testWatchAerodromes(auth, false)
    })
  })
})
