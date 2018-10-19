import React from 'react'
import { renderIntlMaterial } from '../../testutil/renderIntl'
import OrganizationsCreateDialog from './OrganizationsCreateDialog'

describe('components', () => {
  describe('OrganizationsCreateDialog', () => {
    it('renders correctly', () => {
      const renderedValue = renderIntlMaterial(
        <OrganizationsCreateDialog
          data={{ name: 'my_org' }}
          updateData={() => {}}
          open
        />
      )
      expect(renderedValue.html()).toMatchSnapshot()
    })
  })
})
