import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import renderIntl from '../../../../../../testutil/renderIntl'
import OrganizationDetail from './OrganizationDetail'

const StartPage = () => <div>Start Page</div>

describe('components', () => {
  describe('OrganizationDetail', () => {
    it('renders loading icon if organization not loaded', () => {
      const tree = renderIntl(
        <OrganizationDetail
          organizationId="my_org"
          organization={undefined}
          selectOrganization={() => {}}
        />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('redirects to start page if organization was not found', () => {
      const tree = renderIntl(
        <Router>
          <Switch>
            <Route exact path="/" component={StartPage} />
            <OrganizationDetail
              organizationId="my_org"
              organization={null}
              selectOrganization={() => {}}
            />
          </Switch>
        </Router>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders organization if loaded', () => {
      const tree = renderIntl(
        <Router>
          <OrganizationDetail
            organizationId="my_org"
            organization={{ id: 'my_org' }}
            selectOrganization={() => {}}
          />
        </Router>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('calls selectOrganization when mounted', () => {
      const selectOrganization = jest.fn()

      renderIntl(
        <OrganizationDetail
          organizationId="my_org"
          selectOrganization={selectOrganization}
        />
      )

      expect(selectOrganization).toBeCalledWith('my_org')
    })
  })
})
