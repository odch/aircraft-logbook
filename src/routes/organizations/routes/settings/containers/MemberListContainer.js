import { compose } from 'redux'
import { connect } from 'react-redux'
import { fetchMembers } from '../../../module'
import {
  openDeleteMemberDialog,
  closeDeleteMemberDialog,
  deleteMember,
  openEditMemberDialog,
  updateEditMemberDialogData,
  closeEditMemberDialog,
  updateMember,
  setMembersPage
} from '../module'
import MemberList from '../components/MemberList'

export const MEMBERS_PER_PAGE = 10

const mapStateToProps = (state /*, ownProps*/) => {
  let members = undefined
  let pagination = undefined

  const organizationMembers = state.firestore.ordered.organizationMembers
  if (organizationMembers) {
    pagination = {
      rowsCount: organizationMembers.length,
      page: state.organizationSettings.members.page,
      rowsPerPage: MEMBERS_PER_PAGE
    }

    const joinedMembersFirst = Array.prototype.slice
      .call(organizationMembers)
      .sort((m1, m2) => {
        if (!m1.user && m2.user) {
          return 1
        }
        if (!m2.user && m1.user) {
          return -1
        }
        return 0
      })

    const startIndex = pagination.page * MEMBERS_PER_PAGE
    const endIndex = startIndex + MEMBERS_PER_PAGE
    members = joinedMembersFirst.slice(startIndex, endIndex)
  }

  return {
    members,
    pagination,
    deleteMemberDialog: state.organizationSettings.deleteMemberDialog,
    editMemberDialog: state.organizationSettings.editMemberDialog
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
  setMembersPage
}

export default compose(connect(mapStateToProps, mapActionCreators))(MemberList)
