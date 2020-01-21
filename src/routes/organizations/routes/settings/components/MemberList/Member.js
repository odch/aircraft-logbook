import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import {
  member as memberShape,
  intl as intlShape
} from '../../../../../../shapes'
import { formatDate, formatTime } from '../../../../../../util/dates'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core'

const styles = {
  pending: {
    fontStyle: 'italic',
    color: '#AAAAAA'
  }
}

class Member extends React.Component {
  getRoleNames = roles =>
    roles
      ? roles.map(role => this.msg(`organization.role.${role}`)).join(', ')
      : ''

  msg = (id, values) => this.props.intl.formatMessage({ id }, values)

  getPendingInvitationTooltip = member => {
    if (member.inviteTimestamp) {
      return this.msg('organization.invite.pending', {
        inviteDate: formatDate(member.inviteTimestamp),
        inviteTime: formatTime(member.inviteTimestamp)
      })
    }
    return this.msg('organization.invite.notsent')
  }

  render() {
    const { member, openDeleteMemberDialog, classes } = this.props

    const invitePending = !member.user

    const itemText = (
      <ListItemText
        primary={`${member.lastname} ${member.firstname}${
          member.nr ? ` (${member.nr})` : ''
        }`}
        secondary={this.getRoleNames(member.roles)}
      />
    )

    return (
      <ListItem
        key={member.id}
        disableGutters
        className={invitePending ? classes.pending : undefined}
        divider
      >
        {invitePending ? (
          <Tooltip
            title={this.getPendingInvitationTooltip(member)}
            placement="bottom-start"
          >
            {itemText}
          </Tooltip>
        ) : (
          itemText
        )}
        <ListItemSecondaryAction>
          <IconButton onClick={() => openDeleteMemberDialog(member)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

Member.propTypes = {
  member: memberShape.isRequired,
  openDeleteMemberDialog: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(Member))
