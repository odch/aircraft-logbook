import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import featureToggles from 'feature-toggles'
import GoogleLogin from '../../containers/GoogleLoginContainer'
import LoginForm from '../../containers/LoginFormContainer'
import getAuthQueryToken from '../../../../util/getAuthQueryToken'
import LoadingIcon from '../../../../components/LoadingIcon'

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
  componentDidMount() {
    const { auth, router, loginWithToken } = this.props
    if (auth.isEmpty) {
      const queryToken = getAuthQueryToken(router.location)
      if (queryToken) {
        loginWithToken(queryToken)
      }
    }
  }

  render() {
    const { auth, router, tokenLogin, classes } = this.props

    if (!auth.isEmpty) {
      if (router.location.state && router.location.state.from) {
        return <Redirect to={router.location.state.from.pathname} />
      }
      return <Redirect to="/" />
    }

    if (tokenLogin.submitted) {
      return <LoadingIcon />
    }

    if (tokenLogin.failed) {
      return (
        <main className={classes.layout}>
          <FormattedMessage id="login.tokeninvalid" />
        </main>
      )
    }

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
  }).isRequired,
  classes: PropTypes.object.isRequired,
  router: PropTypes.shape({
    location: PropTypes.shape({
      search: PropTypes.string,
      state: PropTypes.shape({
        queryToken: PropTypes.shape({
          orgId: PropTypes.string.isRequired,
          token: PropTypes.string.isRequired
        }),
        from: PropTypes.shape({
          pathname: PropTypes.string.isRequired
        })
      })
    }).isRequired
  }).isRequired,
  tokenLogin: PropTypes.shape({
    submitted: PropTypes.bool.isRequired,
    failed: PropTypes.bool.isRequired
  }).isRequired,
  loginWithToken: PropTypes.func.isRequired
}

export default withStyles(styles)(LoginPage)
