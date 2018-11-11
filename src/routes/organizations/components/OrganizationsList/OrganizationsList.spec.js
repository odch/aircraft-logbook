import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import renderIntl from '../../../../testutil/renderIntl'
import OrganizationsList from './OrganizationsList'

describe('components', () => {
  describe('OrganizationsList', () => {
    it('renders loading icon if organizations not loaded', () => {
      const tree = renderIntl(
        <OrganizationsList
          organizations={undefined}
          createDialogOpen={false}
          createDialogData={{ name: '' }}
          openCreateOrganizationDialog={() => {}}
          closeCreateOrganizationDialog={() => {}}
          updateCreateOrganizationDialogData={() => {}}
          createOrganization={() => {}}
        />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders organizations if loaded', () => {
      const organizations = [{ id: 'org1' }, { id: 'org2' }, { id: 'org3' }]
      const tree = renderIntl(
        <Router>
          <OrganizationsList
            organizations={organizations}
            createDialogOpen={false}
            createDialogData={{ name: '' }}
            openCreateOrganizationDialog={() => {}}
            closeCreateOrganizationDialog={() => {}}
            updateCreateOrganizationDialogData={() => {}}
            createOrganization={() => {}}
          />
        </Router>
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
