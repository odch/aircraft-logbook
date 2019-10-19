import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { renderIntlMaterial } from '../../../../testutil/renderIntl'
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
      const renderedValue = renderIntlMaterial(
        <OrganizationsList
          organizations={undefined}
          createDialog={createDialog}
          openCreateOrganizationDialog={() => {}}
          closeCreateOrganizationDialog={() => {}}
          updateCreateOrganizationDialogData={() => {}}
          createOrganization={() => {}}
        />,
        true
      )
      expect(renderedValue).toMatchSnapshot()
    })

    it('renders organizations if loaded', () => {
      const organizations = [{ id: 'org1' }, { id: 'org2' }, { id: 'org3' }]
      const renderedValue = renderIntlMaterial(
        <Router>
          <OrganizationsList
            organizations={organizations}
            createDialog={createDialog}
            openCreateOrganizationDialog={() => {}}
            closeCreateOrganizationDialog={() => {}}
            updateCreateOrganizationDialogData={() => {}}
            createOrganization={() => {}}
          />
        </Router>,
        true
      )
      expect(renderedValue).toMatchSnapshot()
    })
  })
})
