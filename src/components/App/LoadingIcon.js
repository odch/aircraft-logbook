import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import withStyles from '@material-ui/core/styles/withStyles'

const styles = () => ({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  icon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    margin: '-25px 0 0 -25px'
  }
})

const LoadingIcon = props => (
  <div className={props.classes.container}>
    <CircularProgress size={50} className={props.classes.icon} />
  </div>
)

LoadingIcon.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LoadingIcon)
