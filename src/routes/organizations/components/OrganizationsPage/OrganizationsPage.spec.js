import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import renderIntl from '../../../../testutil/renderIntl'
import OrganizationsPage from './OrganizationsPage'

describe('components', () => {
  describe('OrganizationsPage', () => {
    it('renders correctly', () => {
      const state = {
        firebase: {
          auth: {
            isEmpty: false,
            email: 'test@opendigital.ch'
          },
          profile: {}
        },
        firestore: {},
        main: {
          app: {
            organizations: [{ id: 'org1' }, { id: 'org2' }, { id: 'org3' }]
          }
        },
        organizations: {
          createDialog: {
            open: false,
            data: {
              name: ''
            }
          }
        }
      }

      const store = configureStore()(state)

      const tree = renderIntl(
        <Provider store={store}>
          <Router>
            <OrganizationsPage />
          </Router>
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
