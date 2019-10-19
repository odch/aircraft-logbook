import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import RegistrationForm from '../../containers/RegistrationFormContainer'

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
  }
})

class RegistrationPage extends React.Component {
  render() {
    const { auth, classes } = this.props

    if (!auth.isEmpty) {
      return <Redirect to="/" />
    }

    return (
      <React.Fragment>
        <main className={classes.layout}>
          <RegistrationForm />
        </main>
      </React.Fragment>
    )
  }
}

RegistrationPage.propTypes = {
  auth: PropTypes.shape({
    isEmpty: PropTypes.bool.isRequired
  }),
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RegistrationPage)
