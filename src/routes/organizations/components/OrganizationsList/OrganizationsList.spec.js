import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import renderIntl from '../../../../testutil/renderIntl'
import OrganizationsList from './OrganizationsList'

describe('components', () => {
  describe('OrganizationsList', () => {
    const createDialog = {
      open: false,
      data: {
        name: ''
      }
    }

    it('renders loading icon if organizations not loaded', () => {
      const tree = renderIntl(
        <OrganizationsList
          organizations={undefined}
          createDialog={createDialog}
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
            createDialog={createDialog}
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
