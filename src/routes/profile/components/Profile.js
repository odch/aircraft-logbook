import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import LoadingIcon from '../../../components/App/LoadingIcon'
import isLoaded from '../../../util/isLoaded'
import Locale from '../containers/LocaleContainer'

const styles = theme => ({
  container: {
    padding: '1em',
    [theme.breakpoints.up(1000 + theme.spacing(3 * 2))]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  closeSettingsButton: {
    float: 'right'
  }
})

class Profile extends React.Component {
  render() {
    const { user, classes } = this.props

    if (!isLoaded(user)) {
      return <LoadingIcon />
    }

    return (
      <div className={classes.container}>
        <Typography variant="h4" gutterBottom>
          <FormattedMessage id="profile.title" />
          <Button
            href="/"
            color="primary"
            className={classes.closeSettingsButton}
          >
            <FormattedMessage id="profile.close" />
          </Button>
        </Typography>
        <Locale />
      </div>
    )
  }
}

Profile.propTypes = {
  user: PropTypes.object,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(injectIntl(Profile))
