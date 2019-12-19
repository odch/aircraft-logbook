import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import featureToggles from 'feature-toggles'
import GoogleLogin from '../../containers/GoogleLoginContainer'
import LoginForm from '../../containers/LoginFormContainer'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block',
    marginTop: theme.spacing(8),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  registrationButton: {
    marginTop: '1em'
  },
  google: {
    marginBottom: '2em'
  }
})

class LoginPage extends React.Component {
  render() {
    if (!this.props.auth.isEmpty) {
      return <Redirect to="/" />
    }

    const { classes } = this.props

    return (
      <main className={classes.layout}>
        <GoogleLogin className={classes.google} />
        {featureToggles.isFeatureEnabled('emailPasswordAuth') && (
          <React.Fragment>
            <Typography align="center" color="textSecondary" gutterBottom>
              <FormattedMessage id="login.or" />
            </Typography>
            <LoginForm />
            {featureToggles.isFeatureEnabled('registration') && (
              <Button
                className={classes.registrationButton}
                href="/register"
                variant="text"
                color="primary"
                data-cy="registration"
                fullWidth
              >
                <FormattedMessage id="login.registration" />
              </Button>
            )}
          </React.Fragment>
        )}
      </main>
    )
  }
}

LoginPage.propTypes = {
  auth: PropTypes.shape({
    isEmpty: PropTypes.bool.isRequired
  }),
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LoginPage)
