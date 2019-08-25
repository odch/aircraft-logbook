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
  handleChange = name => e => {
    this.props.updateData({
      [name]: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.register(this.props.registrationForm.data)
  }

  render() {
    const {
      classes,
      registrationForm: { failed, submitted }
    } = this.props

    return (
      <React.Fragment>
        {failed && (
          <Typography className={classes.failureMessage}>
            <FormattedMessage id="registration.failed" />
          </Typography>
        )}
        <form onSubmit={this.handleSubmit}>
          {this.renderFormControl({
            name: 'firstname',
            type: 'text',
            autoFocus: true
          })}
          {this.renderFormControl({
            name: 'lastname',
            type: 'text'
          })}
          {this.renderFormControl({
            name: 'email',
            type: 'email'
          })}
          {this.renderFormControl({
            name: 'password',
            type: 'password'
          })}
          <Button
            type="submit"
            fullWidth
            variant="contained"
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

  renderFormControl(props) {
    const { name, type, autoFocus } = props
    const { data, submitted } = this.props.registrationForm
    return (
      <FormControl margin="normal" required fullWidth>
        <InputLabel htmlFor={name}>
          <FormattedMessage id={`registration.${name}`} />
        </InputLabel>
        <Input
          id={name}
          name={name}
          onChange={this.handleChange(name)}
          value={data[name]}
          disabled={submitted}
          data-cy={name}
          type={type}
          autoFocus={autoFocus}
        />
      </FormControl>
    )
  }
}

RegistrationForm.propTypes = {
  registrationForm: PropTypes.shape({
    data: PropTypes.shape({
      firstname: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired
    }).isRequired,
    failed: PropTypes.bool.isRequired,
    submitted: PropTypes.bool.isRequired
  }).isRequired,
  updateData: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RegistrationForm)
