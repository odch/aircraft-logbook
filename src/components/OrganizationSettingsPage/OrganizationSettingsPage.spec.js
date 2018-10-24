import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import renderIntl from '../../testutil/renderIntl'
import OrganizationSettingsPage from './OrganizationSettingsPage'

describe('components', () => {
  describe('OrganizationSettingsPage', () => {
    it('renders correctly', () => {
      const state = {
        firebase: {
          auth: {
            isEmpty: false
          },
          profile: {}
        },
        firestore: {
          data: {
            organizations: {
              my_org: {}
            }
          }
        }
      }

      const store = configureStore()(state)

      const props = {
        match: {
          params: {
            organizationId: 'my_org'
          }
        }
      }

      const tree = renderIntl(
        <Provider store={store}>
          <Router>
            <OrganizationSettingsPage {...props} />
          </Router>
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
