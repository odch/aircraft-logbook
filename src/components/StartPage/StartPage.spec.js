import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import renderIntl from '../../testutil/renderIntl'
import StartPage from './StartPage'

describe('components', () => {
  describe('StartPage', () => {
    it('renders correctly', () => {
      const store = configureStore()({
        firebase: {
          auth: {
            isEmpty: false,
            email: 'test@example.com'
          },
          profile: {}
        }
      })
      const tree = renderIntl(
        <Provider store={store}>
          <StartPage />
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
