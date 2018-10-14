import React from 'react'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import configureStore from 'redux-mock-store'
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
        }
      }

      const store = configureStore()(state)

      // workaround for containers which use firestoreConnect()
      Object.assign(store, state)

      const tree = renderer
        .create(
          <Provider store={store}>
            <OrganizationsPage />
          </Provider>
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
