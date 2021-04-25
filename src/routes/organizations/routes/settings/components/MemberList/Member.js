import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ScheduleIcon from '@material-ui/icons/Schedule'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import {
  member as memberShape,
  intl as intlShape
} from '../../../../../../shapes'
import { formatDate, formatTime } from '../../../../../../util/dates'

const styles = {
  pendingIcon: {
    minWidth: 30
  },
  notJoined: {
    fontStyle: 'italic',
    color: '#AAAAAA'
  }
}

class Member extends React.Component {
  state = {
    anchorEl: null
  }

  handleMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  handleMenuItemClick = (callback, args) => () => {
    if (typeof callback === 'function') {
      callback(...args)
    }
    this.handleMenuClose()
  }

  getPrimaryText = member => {
    let primaryText = `${member.lastname} ${member.firstname}`
    if (member.nr) {
      primaryText += ` (${member.nr})`
    }
    if (member.instructor) {
      primaryText += ` — ${this.msg('organization.settings.member.instructor')}`
    }
    return primaryText
  }

  getRoleNames = roles =>
    roles
      ? roles
          .map(role => this.msg(`organization.role.${role}`))
          .sort()
          .join(', ')
      : ''

  msg = (id, values) => this.props.intl.formatMessage({ id }, values)

  getPendingInvitationTooltip = member => {
    if (member.user) {
      return this.msg('organization.invite.joined')
    }
    if (member.inviteTimestamp) {
      return this.msg('organization.invite.pending', {
        inviteDate: formatDate(member.inviteTimestamp),
        inviteTime: formatTime(member.inviteTimestamp)
      })
    }
    return this.msg('organization.invite.notsent')
  }

  render() {
    const { member, classes } = this.props

    const invited = !!member.inviteTimestamp
    const invitePending = !member.user && invited
    const joined = !!member.user

    const itemText = (
      <ListItemText
        primary={this.getPrimaryText(member)}
        secondary={this.getRoleNames(member.roles)}
      />
    )

    return (
      <React.Fragment>
        <ListItem
          key={member.id}
          disableGutters
          className={!joined ? classes.notJoined : undefined}
          divider
        >
          {invitePending && (
            <ListItemIcon className={classes.pendingIcon}>
              <ScheduleIcon />
            </ListItemIcon>
          )}
          <Tooltip
            title={this.getPendingInvitationTooltip(member)}
            placement="bottom-start"
          >
            {itemText}
          </Tooltip>
          <ListItemSecondaryAction>
            <IconButton onClick={this.handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {this.state.anchorEl && this.renderMenu()}
      </React.Fragment>
    )
  }

  renderMenu() {
    const {
      member,
      openEditMemberDialog,
      openDeleteMemberDialog,
      openRemoveUserLinkDialog
    } = this.props

    return (
      <Menu anchorEl={this.state.anchorEl} onClose={this.handleMenuClose} open>
        <MenuItem
          onClick={this.handleMenuItemClick(openEditMemberDialog, [member])}
        >
          {this.msg('organization.settings.member.edit')}
        </MenuItem>
        {member.user && (
          <MenuItem
            onClick={this.handleMenuItemClick(openRemoveUserLinkDialog, [
              member
            ])}
          >
            {this.msg('organization.settings.member.removeuserlink')}
          </MenuItem>
        )}
        <MenuItem
          onClick={this.handleMenuItemClick(openDeleteMemberDialog, [member])}
        >
          {this.msg('organization.settings.member.delete')}
        </MenuItem>
      </Menu>
    )
  }
}

Member.propTypes = {
  member: memberShape.isRequired,
  openDeleteMemberDialog: PropTypes.func.isRequired,
  openEditMemberDialog: PropTypes.func.isRequired,
  openRemoveUserLinkDialog: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(Member))
