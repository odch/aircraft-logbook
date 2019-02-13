import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import renderIntl from '../../testutil/renderIntl'
import Header from './Header'
import configureStore from 'redux-mock-store'

describe('components', () => {
  describe('Header', () => {
    it('renders user button if logged in', () => {
      const auth = {
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
          <Router>
            <Header auth={auth} logout={() => {}} />
          </Router>
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('does not render user button if not logged in', () => {
      const auth = {
        isEmpty: true
      }
      const tree = renderIntl(
        <Router>
          <Header auth={auth} logout={() => {}} />
        </Router>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
