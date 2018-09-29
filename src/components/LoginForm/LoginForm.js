import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block',
    marginTop: theme.spacing.unit * 8,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
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
        <main className={classes.layout}>
          {failed && (
            <Typography className={classes.failureMessage}>
              Falsche Login-Daten
            </Typography>
          )}
          <form onSubmit={this.handleSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">E-Mail</InputLabel>
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
              <InputLabel htmlFor="password">Passwort</InputLabel>
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
              Anmelden
            </Button>
          </form>
        </main>
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
