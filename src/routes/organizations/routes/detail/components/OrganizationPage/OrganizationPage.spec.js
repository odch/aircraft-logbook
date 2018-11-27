import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import renderIntl from '../../../../../../testutil/renderIntl'
import OrganizationPage from './OrganizationPage'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('detail', () => {
        describe('components', () => {
          describe('OrganizationPage', () => {
            it('renders correctly', () => {
              const state = {
                firebase: {
                  auth: {
                    isEmpty: false
                  },
                  profile: {}
                },
                main: {
                  app: {
                    organizations: [{ id: 'my_org' }]
                  }
                },
                firestore: {
                  ordered: {
                    organizationAircrafts: [
                      {
                        id: 'o7flC7jw8jmkOfWo8oyA',
                        registration: 'HBKFW'
                      },
                      {
                        id: 'BKi7HYAIoe1i75H3LMk1',
                        registration: 'HBKOF'
                      }
                    ]
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
                    <OrganizationPage {...props} />
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
