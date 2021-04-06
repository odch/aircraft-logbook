import React from 'react'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import CreateMemberDialog from './CreateMemberDialog'

const ROLES = [
  { value: 'manager', label: 'Manager' },
  { value: 'techlogmanager', label: 'Techlog-Manager' }
]

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
                  data={{
                    firstname: 'Max',
                    lastname: 'Muster',
                    id: '24354',
                    roles: []
                  }}
                  errors={{}}
                  updateData={() => {}}
                  open
                  roles={ROLES}
                />,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders readonly if submitting', () => {
              const renderedValue = renderIntlMaterial(
                <CreateMemberDialog
                  organizationId="my_org"
                  data={{
                    firstname: 'Max',
                    lastname: 'Muster',
                    id: '24354',
                    roles: ['manager', 'techlogmanager']
                  }}
                  errors={{}}
                  updateData={() => {}}
                  submitting
                  roles={ROLES}
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
