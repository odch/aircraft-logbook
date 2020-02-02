import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import List from '@material-ui/core/List'
import TablePagination from '@material-ui/core/TablePagination'
import {
  member as memberShape,
  intl as intlShape
} from '../../../../../../shapes'
import isLoaded from '../../../../../../util/isLoaded'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import Member from './Member'
import DeleteMemberDialog from '../DeleteMemberDialog'
import EditMemberDialog from '../EditMemberDialog'

class MemberList extends React.Component {
  componentDidMount() {
    const { organizationId, fetchMembers } = this.props
    fetchMembers(organizationId)
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const {
      organizationId,
      members,
      pagination,
      deleteMemberDialog,
      editMemberDialog,
      openDeleteMemberDialog,
      closeDeleteMemberDialog,
      deleteMember,
      openEditMemberDialog,
      updateEditMemberDialogData,
      closeEditMemberDialog,
      updateMember,
      setMembersPage
    } = this.props

    if (!isLoaded(members)) {
      return <LoadingIcon />
    }

    return (
      <React.Fragment>
        <List>
          {members.map(member => (
            <Member
              key={member.id}
              member={member}
              openDeleteMemberDialog={openDeleteMemberDialog}
              openEditMemberDialog={openEditMemberDialog}
            />
          ))}
        </List>
        <TablePagination
          component="div"
          count={pagination.rowsCount}
          rowsPerPage={pagination.rowsPerPage}
          rowsPerPageOptions={[]}
          page={pagination.page}
          onChangePage={(event, page) => setMembersPage(page)}
        />
        {deleteMemberDialog && deleteMemberDialog.open && (
          <DeleteMemberDialog
            organizationId={organizationId}
            member={deleteMemberDialog.member}
            submitting={deleteMemberDialog.submitting}
            onConfirm={() =>
              deleteMember(organizationId, deleteMemberDialog.member.id)
            }
            onClose={closeDeleteMemberDialog}
          />
        )}
        {editMemberDialog && editMemberDialog.open && (
          <EditMemberDialog
            organizationId={organizationId}
            member={editMemberDialog.member}
            data={editMemberDialog.data}
            submitting={editMemberDialog.submitting}
            reinviteInProgress={editMemberDialog.reinviteInProgress}
            onSubmit={updateMember}
            onClose={closeEditMemberDialog}
            updateData={updateEditMemberDialogData}
          />
        )}
      </React.Fragment>
    )
  }
}

MemberList.propTypes = {
  organizationId: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(memberShape),
  pagination: PropTypes.shape({
    rowsCount: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
  }),
  deleteMemberDialog: PropTypes.shape({
    open: PropTypes.bool,
    submitting: PropTypes.bool,
    member: memberShape
  }),
  editMemberDialog: PropTypes.shape({
    open: PropTypes.bool,
    submitting: PropTypes.bool,
    reinviteInProgress: PropTypes.bool,
    member: memberShape,
    data: PropTypes.shape({
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      nr: PropTypes.string,
      inviteEmail: PropTypes.string,
      reinvite: false
    }).isRequired
  }),
  fetchMembers: PropTypes.func.isRequired,
  openDeleteMemberDialog: PropTypes.func.isRequired,
  closeDeleteMemberDialog: PropTypes.func.isRequired,
  deleteMember: PropTypes.func.isRequired,
  openEditMemberDialog: PropTypes.func.isRequired,
  updateEditMemberDialogData: PropTypes.func.isRequired,
  closeEditMemberDialog: PropTypes.func.isRequired,
  updateMember: PropTypes.func.isRequired,
  setMembersPage: PropTypes.func.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(MemberList)
