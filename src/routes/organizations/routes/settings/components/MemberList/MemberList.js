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
      openDeleteMemberDialog,
      closeDeleteMemberDialog,
      deleteMember,
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
  fetchMembers: PropTypes.func.isRequired,
  openDeleteMemberDialog: PropTypes.func.isRequired,
  closeDeleteMemberDialog: PropTypes.func.isRequired,
  deleteMember: PropTypes.func.isRequired,
  setMembersPage: PropTypes.func.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(MemberList)
