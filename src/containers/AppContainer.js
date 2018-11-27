import { connect } from 'react-redux'
import App from '../components/App'

const DEFAULT_AUTH = { isLoaded: false, isEmpty: true }

const mapStateToProps = (state /*, ownProps*/) => ({
  auth: state.firebase ? state.firebase.auth : DEFAULT_AUTH
})

const mapActionCreators = {}

export default connect(
  mapStateToProps,
  mapActionCreators
)(App)
