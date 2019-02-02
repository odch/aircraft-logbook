import React from 'react'
import renderIntl from '../../../../../../testutil/renderIntl'
import MemberList from './MemberList'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('settings', () => {
        describe('components', () => {
          describe('MemberList', () => {
            it('calls fetchMembers when mounted', () => {
              const fetchMembers = jest.fn()

              renderIntl(
                <MemberList
                  organizationId="my_org"
                  members={undefined}
                  fetchMembers={fetchMembers}
                  openDeleteMemberDialog={() => {}}
                  closeDeleteMemberDialog={() => {}}
                  deleteMember={() => {}}
                  setMembersPage={() => {}}
                />
              )

              expect(fetchMembers).toBeCalledWith('my_org')
            })

            it('renders loading icon if members not loaded', () => {
              const tree = renderIntl(
                <MemberList
                  organizationId="my_org"
                  members={undefined}
                  fetchMembers={() => {}}
                  openDeleteMemberDialog={() => {}}
                  closeDeleteMemberDialog={() => {}}
                  deleteMember={() => {}}
                  setMembersPage={() => {}}
                />
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders members if loaded', () => {
              const tree = renderIntl(
                <MemberList
                  organizationId="my_org"
                  members={[
                    {
                      id: 'member1',
                      firstname: 'Hans',
                      lastname: 'Keller',
                      nr: '34646',
                      roles: ['manager']
                    },
                    {
                      id: 'member2',
                      firstname: 'Max',
                      lastname: 'Muster',
                      roles: ['user']
                    }
                  ]}
                  deleteMemberDialog={{ open: false }}
                  pagination={{
                    rowsCount: 2,
                    page: 0,
                    rowsPerPage: 10
                  }}
                  fetchMembers={() => {}}
                  openDeleteMemberDialog={() => {}}
                  closeDeleteMemberDialog={() => {}}
                  deleteMember={() => {}}
                  setMembersPage={() => {}}
                />
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })
          })
        })
      })
    })
  })
})
