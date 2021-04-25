import React from 'react'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import RemoveUserLinkDialog from './RemoveUserLinkDialog'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('components', () => {
          describe('RemoveUserLinkDialog', () => {
            it('renders correctly', () => {
              const member = {
                id: 'my_test_member',
                firstname: 'Max',
                lastname: 'Muster',
                nr: '23563'
              }
              const renderedValue = renderIntlMaterial(
                <RemoveUserLinkDialog
                  organizationId="my_org"
                  member={member}
                />,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })
          })
        })
      })
    })
  })
})
