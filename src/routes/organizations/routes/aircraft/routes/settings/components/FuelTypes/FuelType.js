import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { fuelType as fuelTypeShape } from '../../../../../../../../shapes/aircraft'
import { intl as intlShape } from '../../../../../../../../shapes'

class FuelType extends React.Component {
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

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const { fuelType } = this.props
    return (
      <React.Fragment>
        <ListItem disableGutters>
          <ListItemText
            primary={fuelType.description}
            secondary={fuelType.name}
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
    const { fuelType, openDeleteFuelTypeDialog } = this.props

    return (
      <Menu anchorEl={this.state.anchorEl} onClose={this.handleMenuClose} open>
        <MenuItem
          onClick={this.handleMenuItemClick(openDeleteFuelTypeDialog, [
            fuelType
          ])}
        >
          {this.msg('aircraft.settings.fueltype.delete')}
        </MenuItem>
      </Menu>
    )
  }
}

FuelType.propTypes = {
  fuelType: fuelTypeShape.isRequired,
  intl: intlShape.isRequired,
  openDeleteFuelTypeDialog: PropTypes.func.isRequired
}

export default injectIntl(FuelType)
