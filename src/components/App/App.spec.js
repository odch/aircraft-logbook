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
          <App
            watchOrganizations={() => {}}
            unwatchOrganizations={() => {}}
            auth={auth}
          />
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders login form if not authenticated', () => {
      const auth = {
        isLoaded: true,
        isEmpty: true
      }
      const store = configureStore()({
        app: {
          login: {
            username: '',
            password: '',
            failed: false,
            submitted: false
          }
        },
        firebase: {
          auth
        }
      })
      const tree = renderIntl(
        <Provider store={store}>
          <App
            watchOrganizations={() => {}}
            unwatchOrganizations={() => {}}
            auth={auth}
          />
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders app if authenticated', () => {
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
          <App
            watchOrganizations={() => {}}
            unwatchOrganizations={() => {}}
            auth={auth}
          />
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('calls watchOrganizations when mounted', () => {
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

      const watchOrganizations = jest.fn()

      renderIntl(
        <Provider store={store}>
          <App
            auth={auth}
            watchOrganizations={watchOrganizations}
            unwatchOrganizations={() => {}}
          />
        </Provider>
      )

      expect(watchOrganizations).toBeCalled()
    })

    it('call unwatchOrganizations when unmounted', () => {
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

      const unwatchOrganizations = jest.fn()

      const instance = renderIntl(
        <Provider store={store}>
          <App
            auth={auth}
            watchOrganizations={() => {}}
            unwatchOrganizations={unwatchOrganizations}
          />
        </Provider>
      )

      instance.unmount()

      expect(unwatchOrganizations).toBeCalled()
    })
  })
})
