import React from 'react'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import OrganizationDeleteDialog from './OrganizationDeleteDialog'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('components', () => {
          describe('OrganizationDeleteDialog', () => {
            it('renders correctly', () => {
              const renderedValue = renderIntlMaterial(
                <OrganizationDeleteDialog organizationId="my_org" open />
              )
              expect(renderedValue.html()).toMatchSnapshot()
            })
          })
        })
      })
    })
  })
})
