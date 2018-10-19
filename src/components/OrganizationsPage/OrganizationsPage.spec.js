import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import renderIntl from '../../testutil/renderIntl'
import OrganizationsPage from './OrganizationsPage'

describe('components', () => {
  describe('OrganizationsPage', () => {
    it('renders correctly', () => {
      const state = {
        firebase: {
          auth: {
            isEmpty: false
          }
        },
        firestore: {
          ordered: {
            organizations: [{ id: 'org1' }, { id: 'org2' }, { id: 'org3' }]
          }
        },
        app: {
          organizations: {
            createDialogOpen: false,
            createDialogData: {
              name: ''
            }
          }
        }
      }

      const store = configureStore()(state)

      // workaround for containers which use firestoreConnect()
      Object.assign(store, state)

      const tree = renderIntl(
        <Provider store={store}>
          <OrganizationsPage />
        </Provider>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
