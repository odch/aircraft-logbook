import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import TablePagination from '@material-ui/core/TablePagination'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/Search'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {
  member as memberShape,
  intl as intlShape
} from '../../../../../../shapes'
import isLoaded from '../../../../../../util/isLoaded'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import CreateMemberDialog from '../../containers/CreateMemberDialogContainer'
import DeleteMemberDialog from '../DeleteMemberDialog'
import EditMemberDialog from '../EditMemberDialog'
import Member from './Member'

const styles = {
  loadingIconContainer: {
    position: 'relative',
    minHeight: '100px'
  }
}

class MemberList extends React.Component {
  componentDidMount() {
    const { organizationId, fetchMembers } = this.props
    fetchMembers(organizationId)
  }

  handleCreateMemberClick = () => {
    this.props.openCreateMemberDialog()
  }

  handleFilterChange = e => {
    this.props.setMembersFilter(e.target.value)
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const {
      organizationId,
      members,
      pagination,
      deleteMemberDialog,
      editMemberDialog,
      memberRoles,
      createMemberDialogOpen,
      openDeleteMemberDialog,
      closeDeleteMemberDialog,
      deleteMember,
      openEditMemberDialog,
      updateEditMemberDialogData,
      closeEditMemberDialog,
      updateMember,
      setMembersPage,
      classes
    } = this.props

    if (!isLoaded(members)) {
      return (
        <div className={classes.loadingIconContainer}>
          <LoadingIcon />
        </div>
      )
    }

    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleCreateMemberClick}
        >
          <FormattedMessage id="organization.settings.createmember" />
        </Button>
        <TextField
          placeholder={this.msg('organization.settings.member.search')}
          onChange={this.handleFilterChange}
          margin="normal"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        {members.length > 0 ? (
          <>
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
          </>
        ) : (
          <Typography paragraph>
            <FormattedMessage id="organization.settings.member.none" />
          </Typography>
        )}
        {createMemberDialogOpen && (
          <CreateMemberDialog organizationId={organizationId} />
        )}
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
            roles={memberRoles}
            submitting={editMemberDialog.submitting}
            reinviteInProgress={editMemberDialog.reinviteInProgress}
            onSubmit={updateMember}
            onClose={closeEditMemberDialog}
            updateData={updateEditMemberDialogData}
          />
        )}
      </>
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
  createMemberDialogOpen: PropTypes.bool,
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
      roles: PropTypes.arrayOf(PropTypes.string),
      inviteEmail: PropTypes.string,
      reinvite: false
    }).isRequired
  }),
  memberRoles: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  classes: PropTypes.object.isRequired,
  fetchMembers: PropTypes.func.isRequired,
  openCreateMemberDialog: PropTypes.func.isRequired,
  openDeleteMemberDialog: PropTypes.func.isRequired,
  closeDeleteMemberDialog: PropTypes.func.isRequired,
  deleteMember: PropTypes.func.isRequired,
  openEditMemberDialog: PropTypes.func.isRequired,
  updateEditMemberDialogData: PropTypes.func.isRequired,
  closeEditMemberDialog: PropTypes.func.isRequired,
  updateMember: PropTypes.func.isRequired,
  setMembersPage: PropTypes.func.isRequired,
  setMembersFilter: PropTypes.func.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(withStyles(styles)(MemberList))
