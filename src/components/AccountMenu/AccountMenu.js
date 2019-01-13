import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import Divider from '@material-ui/core/Divider'
import organizationShape from '../../shapes/organization'

class AccountMenu extends React.Component {
  render() {
    return (
      <Menu
        anchorEl={this.props.anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <MenuItem data-cy="menu-item-username" disabled>
          {this.props.auth.email}
        </MenuItem>
        <Divider key="username-divider" />
        {this.props.organization && [
          <MenuItem
            data-cy="menu-item-selected-organization"
            component={Link}
            to={`/organizations/${this.props.organization.id}`}
            key={`menu-item-selected-organization-${
              this.props.organization.id
            }`}
          >
            {this.props.organization.id}
          </MenuItem>,
          <MenuItem
            data-cy="menu-item-selected-organization-settings"
            component={Link}
            to={`/organizations/${this.props.organization.id}/settings`}
            key={`menu-item-selected-organization-settings-${
              this.props.organization.id
            }`}
          >
            <FormattedMessage id="menu.account.organizationsettings" />
          </MenuItem>,
          <Divider key="selected-organization-divider" />
        ]}
        <MenuItem
          data-cy="menu-item-organizations"
          component={Link}
          to="/organizations"
        >
          <FormattedMessage id="menu.account.organizations" />
        </MenuItem>
        <MenuItem data-cy="menu-item-logout" onClick={this.props.logout}>
          <FormattedMessage id="login.logout" />
        </MenuItem>
      </Menu>
    )
  }
}

AccountMenu.propTypes = {
  auth: PropTypes.shape({
    email: PropTypes.string.isRequired
  }).isRequired,
  organization: organizationShape,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.object,
  logout: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default AccountMenu
