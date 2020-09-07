import { connect } from 'react-redux'
import RegistrationForm from '../components/RegistrationForm'
import { updateData, register, setSubmitted } from '../module'

const mapStateToProps = (state /*, ownProps*/) => ({
  registrationForm: state.registration
})

const mapActionCreators = {
  updateData,
  register,
  setSubmitted
}

export default connect(mapStateToProps, mapActionCreators)(RegistrationForm)
