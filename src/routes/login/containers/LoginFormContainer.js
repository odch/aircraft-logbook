import { connect } from 'react-redux'
import LoginForm from '../components/LoginForm'
import { setUsername, setPassword, login, setSubmitted } from '../module'

const mapStateToProps = (state /*, ownProps*/) => ({
  loginForm: state.login
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
