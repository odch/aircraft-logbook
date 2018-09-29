import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import configureStore from 'redux-mock-store'
import StartPage from './StartPage'

describe('components', () => {
  describe('StartPage', () => {
    it('renders correctly', () => {
      const store = configureStore()({
        firebase: {
          auth: {
            isEmpty: false,
            email: 'test@example.com'
          }
        }
      })
      const tree = renderer
        .create(
          <Provider store={store}>
            <StartPage />
          </Provider>
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
