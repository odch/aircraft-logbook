import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import renderIntl, {
  renderIntlMaterial
} from '../../../../../../testutil/renderIntl'
import OrganizationSettings from './OrganizationSettings'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

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
                    />
                  </Switch>
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('redirects to start page if not manager of organization', () => {
              const tree = renderIntl(
                <Router>
                  <Switch>
                    <Route exact path="/" component={StartPage} />
                    <OrganizationSettings
                      organization={{ id: 'my_org', roles: ['user'] }}
                      deleteOrganization={() => {}}
                    />
                  </Switch>
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders organization settings if loaded', () => {
              const store = configureStore()({
                main: {
                  app: {
                    organizations: [
                      {
                        id: 'my_org',
                        roles: ['manager'],
                        lockDate: {
                          toDate: () => new Date(2020, 10, 5, 0, 0, 0)
                        }
                      }
                    ]
                  }
                },
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
                  },
                  createMemberDialog: {
                    open: false
                  },
                  deleteMemberDialog: {
                    open: false
                  },
                  exportFlightsForm: {
                    submitting: false,
                    data: {
                      startDate: '2019-08-01',
                      endDate: '2019-08-31'
                    }
                  },
                  lockDateForm: {
                    submitting: false
                  },
                  readonlyAccessSwitch: {
                    submitting: false
                  }
                }
              })

              const renderedValue = renderIntlMaterial(
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Provider store={store}>
                    <Router>
                      <OrganizationSettings
                        organization={{ id: 'my_org', roles: ['manager'] }}
                        deleteOrganization={() => {}}
                      />
                    </Router>
                  </Provider>
                </MuiPickersUtilsProvider>,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })
          })
        })
      })
    })
  })
})
