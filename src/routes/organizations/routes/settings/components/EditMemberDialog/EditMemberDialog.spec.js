import React from 'react'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import EditMemberDialog from './EditMemberDialog'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('components', () => {
          describe('EditMemberDialog', () => {
            it('renders without email field if member joined', () => {
              const renderedValue = renderIntlMaterial(
                <EditMemberDialog
                  organizationId="my_org"
                  member={{ user: {} }} // member has a user -> joined
                  data={{ firstname: 'Max', lastname: 'Muster', id: '24354' }}
                  updateData={() => {}}
                />,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders with email field if not invited', () => {
              const renderedValue = renderIntlMaterial(
                <EditMemberDialog
                  organizationId="my_org"
                  member={{ user: undefined, inviteTimestamp: undefined }} // member has no user and no inviteTimestamp -> not invited
                  data={{
                    firstname: 'Max',
                    lastname: 'Muster',
                    id: '24354',
                    inviteEmail: 'max@muster.ch'
                  }}
                  updateData={() => {}}
                />,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders with email field and checkbox if invited but not joined', () => {
              const inviteTimestamp = {
                toDate: () => new Date(2020, 1, 3, 15, 54, 12)
              }
              const renderedValue = renderIntlMaterial(
                <EditMemberDialog
                  organizationId="my_org"
                  member={{ user: undefined, inviteTimestamp }} // member has inviteTimestamp but no user -> invited, but has not yet joined
                  data={{
                    firstname: 'Max',
                    lastname: 'Muster',
                    id: '24354',
                    inviteEmail: 'max@muster.ch',
                    reinvite: true
                  }}
                  updateData={() => {}}
                />,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders readonly if submitting', () => {
              const inviteTimestamp = {
                toDate: () => new Date(2020, 1, 3, 15, 54, 12)
              }
              const renderedValue = renderIntlMaterial(
                <EditMemberDialog
                  organizationId="my_org"
                  member={{ user: undefined, inviteTimestamp }} // member has inviteTimestamp but no user -> invited, but has not yet joined
                  data={{
                    firstname: 'Max',
                    lastname: 'Muster',
                    id: '24354',
                    inviteEmail: 'max@muster.ch',
                    reinvite: true
                  }}
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
