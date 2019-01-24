import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import renderIntl from '../../../../../../testutil/renderIntl'
import OrganizationSettings from './OrganizationSettings'

const StartPage = () => <div>Start Page</div>

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('components', () => {
          describe('OrganizationSettings', () => {
            it('renders loading icon if organization not loaded', () => {
              const tree = renderIntl(
                <OrganizationSettings
                  organization={undefined}
                  deleteOrganization={() => {}}
                  openCreateMemberDialog={() => {}}
                />
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('redirects to start page if organization was not found', () => {
              const tree = renderIntl(
                <Router>
                  <Switch>
                    <Route exact path="/" component={StartPage} />
                    <OrganizationSettings
                      organization={null}
                      deleteOrganization={() => {}}
                      openCreateMemberDialog={() => {}}
                    />
                  </Switch>
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders organization settings if loaded', () => {
              const store = configureStore()({
                firestore: {
                  ordered: {
                    organizationMembers: [
                      {
                        id: 'member1',
                        firstname: 'Hans',
                        lastname: 'Keller',
                        roles: ['manager']
                      },
                      {
                        id: 'member2',
                        firstname: 'Max',
                        lastname: 'Muster',
                        roles: ['user']
                      }
                    ]
                  }
                },
                organizationSettings: {
                  members: {
                    page: 0
                  }
                }
              })

              const tree = renderIntl(
                <Provider store={store}>
                  <Router>
                    <OrganizationSettings
                      organization={{ id: 'my_org' }}
                      deleteOrganization={() => {}}
                      openCreateMemberDialog={() => {}}
                    />
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
