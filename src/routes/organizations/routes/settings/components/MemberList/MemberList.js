import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TablePagination from '@material-ui/core/TablePagination'
import { member as memberShape } from '../../../../../../shapes'
import isLoaded from '../../../../../../util/isLoaded'
import LoadingIcon from '../../../../../../components/LoadingIcon'

class MemberList extends React.Component {
  componentDidMount() {
    const { organizationId, fetchMembers } = this.props
    fetchMembers(organizationId)
  }

  getRoleNames = roles =>
    roles
      ? roles.map(role => this.msg(`organization.role.${role}`)).join(', ')
      : ''

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const { members, pagination, setMembersPage } = this.props

    if (!isLoaded(members)) {
      return <LoadingIcon />
    }

    return (
      <React.Fragment>
        <List>
          {members.map(member => (
            <ListItem key={member.id} disableGutters>
              <ListItemText
                primary={`${member.lastname} ${member.firstname}`}
                secondary={this.getRoleNames(member.roles)}
              />
            </ListItem>
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
  fetchMembers: PropTypes.func.isRequired,
  setMembersPage: PropTypes.func.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(MemberList)
