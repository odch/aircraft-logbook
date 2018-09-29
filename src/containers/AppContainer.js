import { connect } from 'react-redux'
import App from '../components/App'

const mapStateToProps = (state /*, ownProps*/) => ({
  auth: state.firebase.auth
})

const mapDispatchToProps = (/*dispatch, ownProps*/) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
