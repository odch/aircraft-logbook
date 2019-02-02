import React from 'react'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import DeleteMemberDialog from './DeleteMemberDialog'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('components', () => {
          describe('DeleteMemberDialog', () => {
            it('renders correctly', () => {
              const member = {
                id: 'my_test_member',
                firstname: 'Max',
                lastname: 'Muster',
                nr: '23563'
              }
              const renderedValue = renderIntlMaterial(
                <DeleteMemberDialog organizationId="my_org" member={member} />,
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
