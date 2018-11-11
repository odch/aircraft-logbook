import { connect } from 'react-redux'
import RegistrationPage from '../components/RegistrationPage'

const mapStateToProps = (state /*, ownProps*/) => ({
  auth: state.firebase.auth
})

const mapDispatchToProps = (/*dispatch, ownProps*/) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationPage)
