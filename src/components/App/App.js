import React from 'react'
import PropTypes from 'prop-types'
import LoadingIcon from './LoadingIcon'

class App extends React.Component {
  componentDidMount() {
    this.props.watchAerodromes()
  }

  render() {
    if (!this.props.auth.isLoaded) {
      return <LoadingIcon />
    }
    return this.props.children
  }
}

App.propTypes = {
  auth: PropTypes.shape({
    isLoaded: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired
  }),
  children: PropTypes.element,
  watchAerodromes: PropTypes.func.isRequired
}

export default App
