import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
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
  pending: {
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
    const { member, classes } = this.props

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
      <React.Fragment>
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
    const { member, openEditMemberDialog, openDeleteMemberDialog } = this.props

    return (
      <Menu anchorEl={this.state.anchorEl} onClose={this.handleMenuClose} open>
        <MenuItem
          onClick={this.handleMenuItemClick(openEditMemberDialog, [member])}
        >
          {this.msg('organization.settings.member.edit')}
        </MenuItem>
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
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(Member))
