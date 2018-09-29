import { connect } from 'react-redux'
import LoginForm from '../components/LoginForm'
import { setUsername, setPassword, login, setSubmitted } from '../modules/login'

const mapStateToProps = (state /*, ownProps*/) => ({
  loginForm: state.app.login
})

const mapActionCreators = {
  setUsername,
  setPassword,
  login,
  setSubmitted
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(LoginForm)
