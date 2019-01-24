import { compose } from 'redux'
import { connect } from 'react-redux'
import { fetchMembers } from '../../../module'
import { setMembersPage } from '../module'
import MemberList from '../components/MemberList'

export const MEMBERS_PER_PAGE = 10

const mapStateToProps = (state /*, ownProps*/) => {
  let members = undefined
  let pagination = undefined

  if (state.firestore.ordered.organizationMembers) {
    pagination = {
      rowsCount: state.firestore.ordered.organizationMembers.length,
      page: state.organizationSettings.members.page,
      rowsPerPage: MEMBERS_PER_PAGE
    }

    const startIndex = pagination.page * MEMBERS_PER_PAGE
    const endIndex = startIndex + MEMBERS_PER_PAGE
    members = state.firestore.ordered.organizationMembers.slice(
      startIndex,
      endIndex
    )
  }

  return {
    members,
    pagination
  }
}

const mapActionCreators = {
  fetchMembers,
  setMembersPage
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(MemberList)
