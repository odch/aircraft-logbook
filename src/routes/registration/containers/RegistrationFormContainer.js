import { connect } from 'react-redux'
import RegistrationForm from '../components/RegistrationForm'
import { setEmail, setPassword, register, setSubmitted } from '../module'

const mapStateToProps = (state /*, ownProps*/) => ({
  registrationForm: state.registration
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
