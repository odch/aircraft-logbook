import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import OrganizationSettingsPage from './OrganizationSettingsPage'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

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
                  members: {
                    page: 0
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

              const renderedValue = renderIntlMaterial(
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Provider store={store}>
                    <Router>
                      <OrganizationSettingsPage {...props} />
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
