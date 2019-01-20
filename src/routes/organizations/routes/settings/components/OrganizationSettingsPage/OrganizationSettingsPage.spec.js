import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import renderIntl from '../../../../../../testutil/renderIntl'
import OrganizationSettingsPage from './OrganizationSettingsPage'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('components', () => {
          describe('OrganizationSettingsPage', () => {
            it('renders correctly', () => {
              const state = {
                firebase: {
                  auth: {
                    isEmpty: false,
                    email: 'test@opendigital.ch'
                  },
                  profile: {}
                },
                firestore: {
                  ordered: {
                    organizationMembers: [
                      {
                        firstname: 'Max',
                        lastname: 'Muster',
                        id: 'user1'
                      },
                      {
                        firstname: 'Hans',
                        lastname: 'Keller',
                        id: 'user2'
                      }
                    ]
                  }
                },
                main: {
                  app: {
                    organizations: [{ id: 'my_org' }]
                  }
                },
                organizationSettings: {
                  createMemberDialog: {
                    open: false
                  }
                }
              }

              const store = configureStore()(state)

              const props = {
                router: {
                  match: {
                    params: {
                      organizationId: 'my_org'
                    }
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
      })
    })
  })
})
