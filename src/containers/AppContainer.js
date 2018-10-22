import { connect } from 'react-redux'
import App from '../components/App'
import {
  watchOrganizations,
  unwatchOrganizations
} from '../modules/organizations'

const mapStateToProps = (state /*, ownProps*/) => ({
  auth: state.firebase.auth
})

const mapActionCreators = {
  watchOrganizations,
  unwatchOrganizations
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(App)
