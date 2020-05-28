import React from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { check as checkShape } from '../../../../../../../../shapes/aircraft'
import { intl as intlShape } from '../../../../../../../../shapes'
import { formatDate } from '../../../../../../../../util/dates'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'

class Check extends React.Component {
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

  getCheckText = check => {
    const textParts = []

    if (check.dateLimit) {
      textParts.push(formatDate(check.dateLimit))
    }
    if (check.counterLimit) {
      textParts.push(
        `${check.counterLimit} ${this.msg(
          `aircraft.counter.${check.counterReference.toLowerCase()}`
        )}`
      )
    }

    return textParts.join(' / ')
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const { check } = this.props
    return (
      <React.Fragment>
        <ListItem key={check.description} disableGutters>
          <ListItemText
            primary={check.description}
            secondary={this.getCheckText(check)}
          />
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

  renderMenu = () => {
    const { check, openDeleteCheckDialog } = this.props

    return (
      <Menu anchorEl={this.state.anchorEl} onClose={this.handleMenuClose} open>
        <MenuItem
          onClick={this.handleMenuItemClick(openDeleteCheckDialog, [check])}
        >
          {this.msg('aircraft.settings.check.delete')}
        </MenuItem>
      </Menu>
    )
  }
}

Check.propTypes = {
  check: checkShape.isRequired,
  intl: intlShape.isRequired,
  openDeleteCheckDialog: PropTypes.func.isRequired
}

export default injectIntl(Check)
