import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
  failureMessage: {
    color: theme.palette.error.dark
  }
})

class LoginForm extends React.Component {
  handleUsernameChange = e => {
    this.props.setUsername(e.target.value)
  }

  handlePasswordChange = e => {
    this.props.setPassword(e.target.value)
  }

  handleSubmit = e => {
    e.preventDefault()
    const { username, password } = this.props.loginForm
    this.props.login(username, password)
  }

  render() {
    const {
      classes,
      loginForm: { username, password, failed, submitted }
    } = this.props

    return (
      <React.Fragment>
        {failed && (
          <Typography className={classes.failureMessage}>
            <FormattedMessage id="login.failed" />
          </Typography>
        )}
        <form onSubmit={this.handleSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">
              <FormattedMessage id="login.email" />
            </InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="email"
              onChange={this.handleUsernameChange}
              value={username}
              disabled={submitted}
              data-cy="email"
              autoFocus
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">
              <FormattedMessage id="login.password" />
            </InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.handlePasswordChange}
              value={password}
              disabled={submitted}
              data-cy="password"
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="raised"
            color="primary"
            disabled={submitted}
            data-cy="submit"
          >
            <FormattedMessage id="login.login" />
          </Button>
        </form>
      </React.Fragment>
    )
  }
}

LoginForm.propTypes = {
  loginForm: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    failed: PropTypes.bool.isRequired,
    submitted: PropTypes.bool.isRequired
  }).isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LoginForm)
