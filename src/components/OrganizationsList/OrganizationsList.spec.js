import React from 'react'
import renderer from 'react-test-renderer'
import OrganizationsList from './OrganizationsList'

describe('components', () => {
  describe('OrganizationsList', () => {
    it('renders loading icon if organizations not loaded', () => {
      const tree = renderer
        .create(<OrganizationsList loadOrganizations={() => {}} />)
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders organizations if loaded', () => {
      const organizations = [{ id: 'org1' }, { id: 'org2' }, { id: 'org3' }]
      const tree = renderer
        .create(
          <OrganizationsList
            organizations={organizations}
            loadOrganizations={() => {}}
          />
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('calls loadOrganizations when mounted', () => {
      const loadOrganizations = jest.fn()

      renderer.create(
        <OrganizationsList loadOrganizations={loadOrganizations} />
      )

      expect(loadOrganizations).toBeCalled()
    })
  })
})
