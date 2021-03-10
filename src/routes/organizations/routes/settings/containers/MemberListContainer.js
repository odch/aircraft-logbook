import { compose } from 'redux'
import { connect } from 'react-redux'
import { fetchMembers } from '../../../module'
import { getMemberRoles } from '../../../../../util/memberRoles'
import {
  openDeleteMemberDialog,
  closeDeleteMemberDialog,
  deleteMember,
  openEditMemberDialog,
  updateEditMemberDialogData,
  closeEditMemberDialog,
  updateMember,
  setMembersPage,
  setMembersFilter
} from '../module'
import MemberList from '../components/MemberList'
import { injectIntl } from 'react-intl'

export const MEMBERS_PER_PAGE = 10

export const roles = intl =>
  getMemberRoles().map(role => ({
    value: role,
    label: intl.formatMessage({ id: `organization.role.${role}` })
  }))

export const matches = (value, filters) => {
  if (value) {
    const lowerCase = value.toLowerCase()
    for (const filter of filters) {
      if (lowerCase.includes(filter)) {
        return true
      }
    }
  }
  return false
}

export const filterMembers = (members, filter) => {
  const filters = filter
    .split(' ')
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .map(part => part.toLowerCase())

  return filters.length > 0
    ? members.filter(
        member =>
          matches(member.lastname, filters) ||
          matches(member.firstname, filters) ||
          matches(member.nr, filters) ||
          matches(member.inviteEmail, filters)
      )
    : members
}

const mapStateToProps = (state, ownProps) => {
  let members = undefined
  let pagination = undefined

  const organizationMembers = state.firestore.ordered.organizationMembers
  if (organizationMembers) {
    const filteredMembers = filterMembers(
      organizationMembers,
      state.organizationSettings.members.filter || ''
    )

    pagination = {
      rowsCount: filteredMembers.length,
      page: state.organizationSettings.members.page,
      rowsPerPage: MEMBERS_PER_PAGE
    }

    const joinedMembersFirst = Array.prototype.slice
      .call(filteredMembers)
      .sort((m1, m2) => {
        if (m1.user && m2.user) {
          return 0
        }
        if (!m1.user && m2.user) {
          return 1
        }
        if (!m2.user && m1.user) {
          return -1
        }
        if (!m1.inviteTimestamp && m2.inviteTimestamp) {
          return 1
        }
        if (!m2.inviteTimestamp && m1.inviteTimestamp) {
          return -1
        }
      })

    const startIndex = pagination.page * MEMBERS_PER_PAGE
    const endIndex = startIndex + MEMBERS_PER_PAGE
    members = joinedMembersFirst.slice(startIndex, endIndex)
  }

  return {
    members,
    pagination,
    deleteMemberDialog: state.organizationSettings.deleteMemberDialog,
    editMemberDialog: state.organizationSettings.editMemberDialog,
    memberRoles: roles(ownProps.intl)
  }
}

const mapActionCreators = {
  fetchMembers,
  openDeleteMemberDialog,
  closeDeleteMemberDialog,
  deleteMember,
  openEditMemberDialog,
  updateEditMemberDialogData,
  closeEditMemberDialog,
  updateMember,
  setMembersPage,
  setMembersFilter
}

export default injectIntl(
  compose(connect(mapStateToProps, mapActionCreators))(MemberList)
)
