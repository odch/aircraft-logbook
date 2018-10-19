import React from 'react'
import renderIntl from '../../testutil/renderIntl'
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
          watchOrganizations={() => {}}
          unwatchOrganizations={() => {}}
          updateCreateOrganizationDialogData={() => {}}
          createOrganization={() => {}}
        />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders organizations if loaded', () => {
      const organizations = [{ id: 'org1' }, { id: 'org2' }, { id: 'org3' }]
      const tree = renderIntl(
        <OrganizationsList
          organizations={organizations}
          createDialogOpen={false}
          createDialogData={{ name: '' }}
          openCreateOrganizationDialog={() => {}}
          closeCreateOrganizationDialog={() => {}}
          watchOrganizations={() => {}}
          unwatchOrganizations={() => {}}
          updateCreateOrganizationDialogData={() => {}}
          createOrganization={() => {}}
        />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('calls watchOrganizations when mounted', () => {
      const watchOrganizations = jest.fn()

      renderIntl(
        <OrganizationsList
          watchOrganizations={watchOrganizations}
          createDialogOpen={false}
          createDialogData={{ name: '' }}
          openCreateOrganizationDialog={() => {}}
          closeCreateOrganizationDialog={() => {}}
          unwatchOrganizations={() => {}}
          updateCreateOrganizationDialogData={() => {}}
          createOrganization={() => {}}
        />
      )

      expect(watchOrganizations).toBeCalled()
    })

    it('call unwatchOrganizations when unmounted', () => {
      const unwatchOrganizations = jest.fn()

      const instance = renderIntl(
        <OrganizationsList
          unwatchOrganizations={unwatchOrganizations}
          createDialogOpen={false}
          createDialogData={{ name: '' }}
          openCreateOrganizationDialog={() => {}}
          closeCreateOrganizationDialog={() => {}}
          watchOrganizations={() => {}}
          updateCreateOrganizationDialogData={() => {}}
          createOrganization={() => {}}
        />
      )

      instance.unmount()

      expect(unwatchOrganizations).toBeCalled()
    })
  })
})
