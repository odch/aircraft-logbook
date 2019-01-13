import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import renderIntl from '../../../../testutil/renderIntl'
import StartPage from './StartPage'

const MyOrganizationPage = () => <div>My organization</div>
const OrganizationsPage = () => <div>All organizations</div>

describe('routes', () => {
  describe('start', () => {
    describe('components', () => {
      describe('StartPage', () => {
        it('renders loading icon as long as selectedOrgnaization is not loaded', () => {
          const tree = renderIntl(
            <StartPage selectedOrganization={undefined} />
          ).toJSON()
          expect(tree).toMatchSnapshot()
        })

        it('redirects to selected organization if set', () => {
          const tree = renderIntl(
            <Router>
              <Switch>
                <Route
                  exact
                  path="/organizations/my_org"
                  component={MyOrganizationPage}
                />
                <StartPage selectedOrganization={{ id: 'my_org' }} />
              </Switch>
            </Router>
          ).toJSON()
          expect(tree).toMatchSnapshot()
        })

        it('redirects to organizations page if selected organization not found or set', () => {
          const tree = renderIntl(
            <Router>
              <Switch>
                <Route
                  exact
                  path="/organizations"
                  component={OrganizationsPage}
                />
                <StartPage selectedOrganization={null} />
              </Switch>
            </Router>
          ).toJSON()
          expect(tree).toMatchSnapshot()
        })
      })
    })
  })
})
