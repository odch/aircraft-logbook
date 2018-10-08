import { connect } from 'react-redux'
import RegistrationForm from '../components/RegistrationForm'
import {
  setEmail,
  setPassword,
  register,
  setSubmitted
} from '../modules/registration'

const mapStateToProps = (state /*, ownProps*/) => ({
  registrationForm: state.app.registration
})

const mapActionCreators = {
  setEmail,
  setPassword,
  register,
  setSubmitted
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(RegistrationForm)
