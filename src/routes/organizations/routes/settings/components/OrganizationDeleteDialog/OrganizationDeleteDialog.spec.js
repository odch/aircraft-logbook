import React from 'react'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import OrganizationDeleteDialog from './OrganizationDeleteDialog'

describe('components', () => {
  describe('OrganizationDeleteDialog', () => {
    it('renders correctly', () => {
      const renderedValue = renderIntlMaterial(
        <OrganizationDeleteDialog
          data={{ name: 'my_org' }}
          updateData={() => {}}
          open
        />
      )
      expect(renderedValue.html()).toMatchSnapshot()
    })
  })
})
