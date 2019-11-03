import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Redirect } from 'react-router-dom'
import isLoaded from '../../../../../../util/isLoaded'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import GoogleLogin from '../../../../../login/containers/GoogleLoginContainer'
import { FormattedMessage } from 'react-intl'

const styles = (/*theme*/) => ({
  container: {
    textAlign: 'center',
    position: 'relative'
  },
  acceptButton: {
    marginTop: '1em',
    marginBottom: '1em'
  },
  loginContainer: {
    marginTop: '2em'
  },
  loginText: {
    marginBottom: '1em'
  }
})

class Invitation extends React.Component {
  componentDidMount() {
    const { invite, organizationId, inviteId, fetchInvite } = this.props

    if (!isLoaded(invite)) {
      fetchInvite(organizationId, inviteId)
    }
  }

  handleAccept = () => {
    const { organizationId, inviteId, acceptInvite } = this.props
    acceptInvite(organizationId, inviteId)
  }

  render() {
    const {
      organizationId,
      invite,
      auth,
      acceptInProgress,
      logout,
      classes
    } = this.props

    if (!isLoaded(invite)) {
      return (
        <div className={classes.container}>
          <LoadingIcon />
        </div>
      )
    }

    if (invite === null) {
      return (
        <div className={classes.container}>
          <Typography>
            <FormattedMessage id="organization.invite.invalid" />
          </Typography>
        </div>
      )
    }

    if (invite.accepted === true) {
      return <Redirect to={`/organizations/${organizationId}`} />
    }

    return (
      <div className={classes.container}>
        <Typography variant="h4" gutterBottom>
          <FormattedMessage
            id="organization.invite.greeting"
            values={{ firstname: invite.firstname }}
          />
        </Typography>
        <Typography gutterBottom>
          <FormattedMessage
            id="organization.invite.text"
            values={{ organization: <strong>{organizationId}</strong> }}
          />
        </Typography>
        {auth.isEmpty && (
          <div className={classes.loginContainer}>
            <Typography className={classes.loginText}>
              <FormattedMessage id="organization.invite.login" />
            </Typography>
            <GoogleLogin />
          </div>
        )}
        {!auth.isEmpty && (
          <React.Fragment>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleAccept}
              className={classes.acceptButton}
              disabled={acceptInProgress}
              fullWidth
            >
              {acceptInProgress && (
                <CircularProgress
                  size={16}
                  className={classes.loadingIndicator}
                />
              )}
              <FormattedMessage
                id="organization.invite.accept"
                values={{ account: auth.email }}
              />
            </Button>
            <Button onClick={logout} disabled={acceptInProgress} fullWidth>
              <FormattedMessage id="organization.invite.change_account" />
            </Button>
          </React.Fragment>
        )}
      </div>
    )
  }
}

Invitation.propTypes = {
  auth: PropTypes.shape({
    isLoaded: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    email: PropTypes.string
  }).isRequired,
  organizationId: PropTypes.string.isRequired,
  inviteId: PropTypes.string.isRequired,
  invite: PropTypes.shape({
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    accepted: PropTypes.bool.isRequired
  }),
  acceptInProgress: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  fetchInvite: PropTypes.func.isRequired,
  acceptInvite: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}

export default withStyles(styles)(Invitation)
