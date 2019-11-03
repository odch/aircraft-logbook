import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Invitation from '../../containers/InvitationContainer'

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block',
    marginTop: theme.spacing(8),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(500 + theme.spacing(3 * 2))]: {
      width: 500,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }
})

const InvitePage = ({ router: { match }, classes }) => (
  <main className={classes.layout}>
    <Invitation match={match} />
  </main>
)

InvitePage.propTypes = {
  router: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.object.isRequired
    }).isRequired
  }),
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(InvitePage)
