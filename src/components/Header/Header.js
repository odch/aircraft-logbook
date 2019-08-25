import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import AccountMenu from '../../containers/AccountMenuContainer'

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  homeLink: {
    textDecoration: 'none',
    color: 'white'
  }
}

class Header extends React.Component {
  state = {
    anchorEl: null
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { classes, auth } = this.props
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            <Link to="/" className={classes.homeLink}>
              Open Digital Flugreisebuch
            </Link>
          </Typography>
          {!auth.isEmpty && (
            <div>
              <IconButton
                data-cy="user-button"
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <AccountMenu
                open={open}
                anchorEl={anchorEl}
                onClose={this.handleClose}
              />
            </div>
          )}
        </Toolbar>
      </AppBar>
    )
  }
}

Header.propTypes = {
  auth: PropTypes.shape({
    isEmpty: PropTypes.bool.isRequired,
    email: PropTypes.string
  }).isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Header)
