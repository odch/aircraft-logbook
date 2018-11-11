import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import renderIntl from '../../../../../../testutil/renderIntl'
import OrganizationSettings from './OrganizationSettings'

const StartPage = () => <div>Start Page</div>

describe('components', () => {
  describe('OrganizationSettings', () => {
    it('renders loading icon if organization not loaded', () => {
      const tree = renderIntl(
        <OrganizationSettings
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
            <OrganizationSettings
              organizationId="my_org"
              organization={null}
              selectOrganization={() => {}}
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
        <OrganizationSettings
          organizationId="my_org"
          selectOrganization={selectOrganization}
        />
      )

      expect(selectOrganization).toBeCalledWith('my_org')
    })
  })
})
