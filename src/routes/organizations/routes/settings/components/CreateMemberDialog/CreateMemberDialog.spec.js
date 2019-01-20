import React from 'react'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import CreateMemberDialog from './CreateMemberDialog'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('components', () => {
          describe('CreateMemberDialog', () => {
            it('renders correctly', () => {
              const renderedValue = renderIntlMaterial(
                <CreateMemberDialog
                  organizationId="my_org"
                  data={{ firstname: 'Max', lastname: 'Muster' }}
                  updateData={() => {}}
                  open
                />,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders readonly if submitting', () => {
              const renderedValue = renderIntlMaterial(
                <CreateMemberDialog
                  organizationId="my_org"
                  data={{ firstname: 'Max', lastname: 'Muster' }}
                  updateData={() => {}}
                  submitting
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
