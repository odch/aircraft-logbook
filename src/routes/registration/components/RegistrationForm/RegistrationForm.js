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

class RegistrationForm extends React.Component {
  handleEmailChange = e => {
    this.props.setEmail(e.target.value)
  }

  handlePasswordChange = e => {
    this.props.setPassword(e.target.value)
  }

  handleSubmit = e => {
    e.preventDefault()
    const { email, password } = this.props.registrationForm
    this.props.register(email, password)
  }

  render() {
    const {
      classes,
      registrationForm: { email, password, failed, submitted }
    } = this.props

    return (
      <React.Fragment>
        {failed && (
          <Typography className={classes.failureMessage}>
            <FormattedMessage id="registration.failed" />
          </Typography>
        )}
        <form onSubmit={this.handleSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">
              <FormattedMessage id="registration.email" />
            </InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="email"
              onChange={this.handleEmailChange}
              value={email}
              disabled={submitted}
              data-cy="email"
              autoFocus
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">
              <FormattedMessage id="registration.password" />
            </InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
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
            <FormattedMessage id="registration.register" />
          </Button>
        </form>
      </React.Fragment>
    )
  }
}

RegistrationForm.propTypes = {
  registrationForm: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    failed: PropTypes.bool.isRequired,
    submitted: PropTypes.bool.isRequired
  }).isRequired,
  setEmail: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RegistrationForm)
