import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import logo from './Google_G_Logo.svg'

const styles = theme => ({
  failureMessage: {
    color: theme.palette.error.dark
  },
  button: {
    backgroundColor: 'white'
  },
  logo: {
    height: '60%',
    position: 'absolute',
    left: 10
  }
})

class GoogleLogin extends React.Component {
  handleClick = () => {
    this.props.loginGoogle()
  }

  render() {
    const {
      className,
      classes,
      googleLogin: { failed }
    } = this.props

    return (
      <div className={className}>
        <Button
          variant="contained"
          onClick={this.handleClick}
          className={classes.button}
          size="large"
          fullWidth
        >
          <img src={logo} alt="Google Logo" className={classes.logo} />
          <FormattedMessage id="login.google" />
        </Button>
        {failed && (
          <Typography className={classes.failureMessage}>
            <FormattedMessage id="login.failed" />
          </Typography>
        )}
      </div>
    )
  }
}

GoogleLogin.propTypes = {
  className: PropTypes.string,
  googleLogin: PropTypes.shape({
    failed: PropTypes.bool
  }).isRequired,
  loginGoogle: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(GoogleLogin)
