import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
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
                  fetchMembers={() => {}}
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
                      fetchMembers={() => {}}
                      openCreateMemberDialog={() => {}}
                    />
                  </Switch>
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders organization settings if loaded', () => {
              const tree = renderIntl(
                <Router>
                  <OrganizationSettings
                    organization={{ id: 'my_org' }}
                    members={[
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
                    ]}
                    deleteOrganization={() => {}}
                    fetchMembers={() => {}}
                    openCreateMemberDialog={() => {}}
                  />
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })
          })
        })
      })
    })
  })
})
